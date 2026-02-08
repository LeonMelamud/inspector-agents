/**
 * Structured logging utility with security-conscious defaults
 * - Avoids logging sensitive data in production
 * - Provides consistent log format
 * - Can be extended to integrate with external logging services
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'security';

interface LogMeta {
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV === 'development';

/**
 * Sanitize metadata to remove potentially sensitive fields
 */
function sanitizeMeta(meta?: LogMeta): LogMeta | undefined {
  if (!meta) return undefined;
  
  const sensitiveKeys = [
    'password',
    'api_key',
    'apiKey',
    'secret',
    'token',
    'authorization',
    'cookie',
    'session',
    'credit_card',
    'ssn',
  ];
  
  const sanitized: LogMeta = {};
  
  for (const [key, value] of Object.entries(meta)) {
    const lowerKey = key.toLowerCase();
    
    // Check if key contains sensitive terms
    if (sensitiveKeys.some((s) => lowerKey.includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeMeta(value as LogMeta);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Format log message with timestamp and level
 */
function formatLog(level: LogLevel, message: string, meta?: LogMeta): string {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  if (meta) {
    return `${prefix} ${message} ${JSON.stringify(sanitizeMeta(meta))}`;
  }
  
  return `${prefix} ${message}`;
}

export const logger = {
  /**
   * Debug logs - only shown in development
   */
  debug: (message: string, meta?: LogMeta): void => {
    if (isDev) {
      console.log(formatLog('debug', message, meta));
    }
  },
  
  /**
   * Info logs - only shown in development
   */
  info: (message: string, meta?: LogMeta): void => {
    if (isDev) {
      console.log(formatLog('info', message, meta));
    }
  },
  
  /**
   * Warning logs - shown in all environments
   */
  warn: (message: string, meta?: LogMeta): void => {
    console.warn(formatLog('warn', message, sanitizeMeta(meta)));
  },
  
  /**
   * Error logs - shown in all environments
   * Sanitizes sensitive data and avoids exposing stack traces in production
   */
  error: (message: string, error?: Error | unknown, meta?: LogMeta): void => {
    const errorInfo: LogMeta = {
      ...sanitizeMeta(meta),
    };
    
    if (error instanceof Error) {
      errorInfo.errorMessage = error.message;
      if (isDev) {
        errorInfo.stack = error.stack;
      }
    } else if (error) {
      errorInfo.error = String(error);
    }
    
    console.error(formatLog('error', message, errorInfo));
    
    // In production, you might want to send to an error tracking service
    // Example: Sentry.captureException(error);
  },
  
  /**
   * Security event logs - always logged, formatted for security monitoring
   * Use for: rate limit hits, invalid auth attempts, suspicious activity
   */
  security: (event: string, details: LogMeta): void => {
    const securityMeta: LogMeta = {
      event,
      ...sanitizeMeta(details),
      timestamp: Date.now(),
    };
    
    console.warn(formatLog('security', `SECURITY_EVENT: ${event}`, securityMeta));
    
    // In production, send to security monitoring service
    // Example: sendToSecurityService(securityMeta);
  },
  
  /**
   * API request log - for tracking API usage
   */
  apiRequest: (
    endpoint: string,
    method: string,
    statusCode: number,
    durationMs: number,
    meta?: LogMeta
  ): void => {
    const requestMeta: LogMeta = {
      endpoint,
      method,
      statusCode,
      durationMs,
      ...sanitizeMeta(meta),
    };
    
    if (statusCode >= 400) {
      console.warn(formatLog('warn', `API ${method} ${endpoint} - ${statusCode}`, requestMeta));
    } else if (isDev) {
      console.log(formatLog('info', `API ${method} ${endpoint} - ${statusCode}`, requestMeta));
    }
  },
};

export default logger;
