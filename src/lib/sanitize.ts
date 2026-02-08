/**
 * Input sanitization utilities to prevent XSS and injection attacks.
 *
 * Strategy: HTML-encode dangerous characters instead of stripping them,
 * so the original meaning is preserved while making the output safe for
 * HTML contexts.
 */

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

const HTML_CHARS_RE = /[&<>"']/g;

/** Encode HTML-special chars into their entity equivalents. */
export function escapeHtml(str: string): string {
  return str.replace(HTML_CHARS_RE, (ch) => HTML_ENTITY_MAP[ch] ?? ch);
}

/**
 * Sanitize generic user input to prevent XSS and injection attacks.
 * Returns an HTML-safe, length-limited string.
 */
export function sanitizeInput(input: string | undefined | null): string {
  if (!input || typeof input !== 'string') return '';

  let s = input.trim();
  // Strip dangerous protocol handlers (case-insensitive, handles whitespace tricks)
  s = s.replace(/j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/gi, '');
  s = s.replace(/on\w+\s*=/gi, '');
  s = s.replace(/data\s*:/gi, '');
  // Remove null bytes (common obfuscation vector)
  s = s.replace(/\0/g, '');
  // Encode remaining HTML chars
  s = escapeHtml(s);
  return s.slice(0, 500);
}

/**
 * Sanitize email address.
 * Lowercases + strips anything outside a valid email character set.
 */
export function sanitizeEmail(email: string | undefined | null): string {
  if (!email || typeof email !== 'string') return '';

  return email
    .trim()
    .toLowerCase()
    // Only keep characters valid in an email address
    .replace(/[^a-z0-9._%+\-@]/g, '')
    .slice(0, 254); // Max email length per RFC 5321
}

/**
 * Sanitize and validate array of strings.
 */
export function sanitizeArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];

  return arr
    .filter((item): item is string => typeof item === 'string')
    .map(sanitizeInput)
    .filter((item) => item.length > 0)
    .slice(0, 50);
}

/**
 * Sanitize a name field (more restrictive — allowlist approach).
 */
export function sanitizeName(name: string | undefined | null): string {
  if (!name || typeof name !== 'string') return '';

  return name
    .trim()
    .replace(/[^a-zA-Z0-9\s\-'.\u00C0-\u024F]/g, '') // letters (including accented), digits, spaces, hyphens, apostrophes, dots
    .slice(0, 100);
}

/**
 * Validate risk level enum
 */
export function validateRiskLevel(level: unknown): 'low' | 'medium' | 'high' | null {
  const validLevels = ['low', 'medium', 'high'] as const;
  if (typeof level === 'string' && validLevels.includes(level as typeof validLevels[number])) {
    return level as 'low' | 'medium' | 'high';
  }
  return null;
}

/**
 * Sanitize quiz answers object
 */
export function sanitizeQuizAnswers(answers: unknown): Record<string, string | string[]> {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return {};
  }
  
  const sanitized: Record<string, string | string[]> = {};
  const input = answers as Record<string, unknown>;
  
  // Known string fields
  const stringFields = [
    'currentUsage',
    'email',
  ];
  
  // Known array fields
  const arrayFields = ['biggestFears'];
  
  for (const field of stringFields) {
    if (field in input) {
      sanitized[field] = sanitizeInput(input[field] as string);
    }
  }
  
  for (const field of arrayFields) {
    if (field in input) {
      sanitized[field] = sanitizeArray(input[field]);
    }
  }
  
  return sanitized;
}
