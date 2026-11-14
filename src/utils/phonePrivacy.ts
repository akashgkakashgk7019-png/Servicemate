/**
 * Phone Privacy and Masking Utilities
 * Ensures user's self phone number is never displayed in plaintext on the web.
 */

/**
 * Masks a phone number to protect privacy on the web.
 * e.g., '+91 98765 43210' -> '+91 98*** **210'
 * e.g., '9876543210' -> '98*** **210'
 * e.g., '+1 555-123-4567' -> '+1 55*** **567'
 */
export function maskPhoneNumber(phone?: string | null, fullHide = false): string {
  if (!phone) return '••••••••••';
  
  const trimmed = phone.trim();
  if (fullHide) {
    return '•••••••••• (Hidden)';
  }

  // Extract clean digits
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 7) {
    return '•••••• (Protected)';
  }

  // If Indian mobile number with country code (+91...)
  if (trimmed.startsWith('+91') || digits.length === 12) {
    const nationalDigits = digits.slice(-10);
    const start = nationalDigits.slice(0, 2);
    const end = nationalDigits.slice(-3);
    return `+91 ${start}*** **${end}`;
  }

  // 10-digit mobile number
  if (digits.length === 10) {
    const start = digits.slice(0, 2);
    const end = digits.slice(-3);
    return `${start}*** **${end}`;
  }

  // Generic fallback
  const first2 = trimmed.slice(0, Math.min(4, Math.floor(trimmed.length / 3)));
  const last3 = trimmed.slice(-3);
  return `${first2}••••••${last3}`;
}

/**
 * Normalizes phone numbers for SMS gateway and WhatsApp dispatch
 */
export function normalizePhoneForDispatch(phone: string): { cleanDigits: string; internationalNumber: string } {
  let clean = phone.replace(/[^\d+]/g, '');
  
  // Remove leading zeros
  clean = clean.replace(/^0+/, '');

  let internationalNumber = clean;
  if (!clean.startsWith('+')) {
    if (clean.length === 10) {
      internationalNumber = `+91${clean}`;
    } else {
      internationalNumber = `+${clean}`;
    }
  }

  const cleanDigits = internationalNumber.replace(/\D/g, '');
  return { cleanDigits, internationalNumber };
}
