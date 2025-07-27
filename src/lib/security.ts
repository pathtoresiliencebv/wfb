import DOMPurify from 'dompurify';

/**
 * Security utilities for input validation and sanitization
 */

// Input sanitization
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'title', 'target'],
    ALLOW_DATA_ATTR: false,
  });
};

export const sanitizeText = (text: string): string => {
  return text.trim().replace(/[<>]/g, '');
};

// Input validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (username.length < 3) {
    return { isValid: false, error: 'Gebruikersnaam moet minstens 3 karakters lang zijn' };
  }
  if (username.length > 30) {
    return { isValid: false, error: 'Gebruikersnaam mag maximaal 30 karakters lang zijn' };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: 'Gebruikersnaam mag alleen letters, cijfers, underscores en streepjes bevatten' };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (password.length < 8) {
    return { isValid: false, error: 'Wachtwoord moet minstens 8 karakters lang zijn' };
  }
  if (password.length > 128) {
    return { isValid: false, error: 'Wachtwoord mag maximaal 128 karakters lang zijn' };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Wachtwoord moet minstens één kleine letter, één hoofdletter en één cijfer bevatten' };
  }
  return { isValid: true };
};

// Content validation
export const validateTopicTitle = (title: string): { isValid: boolean; error?: string } => {
  const cleanTitle = sanitizeText(title);
  if (cleanTitle.length < 5) {
    return { isValid: false, error: 'Titel moet minstens 5 karakters lang zijn' };
  }
  if (cleanTitle.length > 200) {
    return { isValid: false, error: 'Titel mag maximaal 200 karakters lang zijn' };
  }
  return { isValid: true };
};

export const validateContent = (content: string): { isValid: boolean; error?: string } => {
  const cleanContent = content.trim();
  if (cleanContent.length < 10) {
    return { isValid: false, error: 'Inhoud moet minstens 10 karakters lang zijn' };
  }
  if (cleanContent.length > 10000) {
    return { isValid: false, error: 'Inhoud mag maximaal 10.000 karakters lang zijn' };
  }
  return { isValid: true };
};

// Rate limiting helpers - Enhanced IP detection
export const getClientIP = (): string => {
  // Check for forwarded IP headers in order of preference
  const forwardedFor = (window as any).__REQUEST_HEADERS__?.['x-forwarded-for'];
  const realIP = (window as any).__REQUEST_HEADERS__?.['x-real-ip'];
  const cfConnectingIP = (window as any).__REQUEST_HEADERS__?.['cf-connecting-ip'];
  
  const clientIP = forwardedFor || realIP || cfConnectingIP || '127.0.0.1';
  
  // Extract first IP if comma-separated
  if (clientIP.includes(',')) {
    return clientIP.split(',')[0].trim();
  }
  
  return clientIP;
};

// Security headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// CSRF token generation
export const generateCSRFToken = (): string => {
  return crypto.randomUUID();
};

// SQL injection prevention helpers
export const escapeForSQL = (value: string): string => {
  return value.replace(/'/g, "''").replace(/\\/g, '\\\\');
};

// Common security patterns
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const sanitizeSearchQuery = (query: string): string => {
  return query.trim()
    .replace(/[<>]/g, '')
    .replace(/['"]/g, '')
    .substring(0, 100);
};