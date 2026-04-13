/**
 * Sanitise user text input — strip potential injection patterns and limit length.
 */
const MAX_INPUT_LENGTH = 5000;

export function sanitiseInput(text: string): string {
  if (!text || typeof text !== 'string') return '';

  // Trim and limit length
  let clean = text.trim().slice(0, MAX_INPUT_LENGTH);

  // Remove null bytes
  clean = clean.replace(/\0/g, '');

  // Remove HTML tags repeatedly until stable (prevent nested tag injection)
  let previous = '';
  while (previous !== clean) {
    previous = clean;
    clean = clean.replace(/<[^>]*>/g, '');
  }

  return clean;
}

/**
 * Validate that a session ID is a safe string (numeric timestamp)
 */
export function isValidSessionId(id: string): boolean {
  return /^\d{13,}$/.test(id);
}

/**
 * Validate assessment type
 */
const VALID_TYPES = ['attachment', 'love', 'conflict', 'window', 'need'];
export function isValidAssessmentType(type: string): boolean {
  return VALID_TYPES.includes(type);
}
