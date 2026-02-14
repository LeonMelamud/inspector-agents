/**
 * Rate limiting utility for API endpoints
 *
 * In-memory sliding-window rate limiter. Works without external deps.
 * For production with multiple serverless instances, use Upstash Redis:
 *   npm install @upstash/ratelimit @upstash/redis
 */

interface RateLimitRecord {
  /** Timestamps of requests within the current window */
  timestamps: number[];
}

// In-memory store — resets on cold start (acceptable for serverless)
const store = new Map<string, RateLimitRecord>();

/** Max entries before forced eviction to prevent unbounded growth */
const MAX_STORE_SIZE = 10_000;

/**
 * Evict expired entries inline (no setInterval — avoids leaked timers
 * in serverless/edge runtimes where the process is short-lived).
 */
function evictExpired(windowMs: number): void {
  if (store.size <= MAX_STORE_SIZE) return;

  const now = Date.now();
  for (const [key, record] of store) {
    // Remove if all timestamps are outside the window
    if (record.timestamps.every((ts) => now - ts > windowMs)) {
      store.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
  /** Prefix for the rate limit key */
  prefix?: string;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  success: boolean;
  /** Maximum requests allowed */
  limit: number;
  /** Remaining requests in the current window */
  remaining: number;
  /** Unix timestamp (ms) when the earliest request in the window expires */
  reset: number;
  /** Seconds until the caller should retry */
  retryAfter: number;
}

/**
 * Sliding-window rate limit check for a given identifier.
 * Each request is tracked individually so the window slides naturally.
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 5, windowSeconds: 60 },
): RateLimitResult {
  const { limit, windowSeconds, prefix = 'rl' } = config;
  const key = `${prefix}:${identifier}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  // Lazy eviction when store grows too large
  evictExpired(windowMs);

  let record = store.get(key);

  if (!record) {
    record = { timestamps: [] };
    store.set(key, record);
  }

  // Drop timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  // Check before adding the new request
  const allowed = record.timestamps.length < limit;

  if (allowed) {
    record.timestamps.push(now);
  }

  const remaining = Math.max(0, limit - record.timestamps.length);
  const oldestInWindow = record.timestamps[0] ?? now;
  const reset = oldestInWindow + windowMs;
  const retryAfter = allowed ? 0 : Math.ceil((reset - now) / 1000);

  return {
    success: allowed,
    limit,
    remaining,
    reset,
    retryAfter,
  };
}

/**
 * Create a rate limiter with specific configuration
 */
export function createRateLimiter(config: RateLimitConfig) {
  return {
    limit: (identifier: string) => checkRateLimit(identifier, config),
  };
}

/**
 * Default rate limiters for different use cases
 */
export const rateLimiters = {
  /** API endpoint: 5 requests per minute */
  api: createRateLimiter({ limit: 5, windowSeconds: 60, prefix: 'api' }),
  
  /** Email subscription: 5 requests per 5 minutes */
  subscribe: createRateLimiter({ limit: 5, windowSeconds: 300, prefix: 'sub' }),
  
  /** Strict rate limit: 2 requests per minute */
  strict: createRateLimiter({ limit: 2, windowSeconds: 60, prefix: 'strict' }),
};

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  // Check common headers for proxied requests
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP in case of multiple proxies
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  
  // Fallback for development
  return '127.0.0.1';
}

/**
 * Get rate limit response headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.reset),
    'Retry-After': String(result.retryAfter),
  };
}
