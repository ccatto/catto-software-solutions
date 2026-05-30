/**
 * Phone number utility functions
 *
 * All phone numbers should be stored in E.164 format: +15551234567
 * This ensures consistent matching across the application.
 */

/**
 * Normalize phone number to E.164 format
 *
 * Accepts various formats:
 * - (555) 123-4567 → +15551234567
 * - 555-123-4567 → +15551234567
 * - 5551234567 → +15551234567
 * - 15551234567 → +15551234567
 * - +15551234567 → +15551234567 (already normalized)
 *
 * @param phone - Phone number in any format
 * @returns Normalized E.164 format phone number, or null if invalid
 */
export function normalizePhoneNumber(
  phone: string | null | undefined,
): string | null {
  if (!phone) return null;

  // Remove all non-digit characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, '');

  // If no + prefix, assume US number and add +1
  if (!cleaned.startsWith('+')) {
    // Remove leading 1 if 11 digits (US format with country code)
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      cleaned = cleaned.substring(1);
    }
    // Add +1 for US numbers (10 digits)
    if (cleaned.length === 10) {
      cleaned = '+1' + cleaned;
    }
  }

  // Validate E.164 format: + followed by 10-15 digits
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  if (!e164Regex.test(cleaned)) {
    return null;
  }

  return cleaned;
}

/**
 * Format phone number for display
 *
 * Converts E.164 format to human-readable US format:
 * +15551234567 → (555) 123-4567
 *
 * @param phone - Phone number in E.164 format
 * @returns Formatted display string, or original if not US format
 */
export function formatPhoneForDisplay(
  phone: string | null | undefined,
): string {
  if (!phone) return '';

  // If it's a US number in E.164 format
  if (phone.startsWith('+1') && phone.length === 12) {
    const digits = phone.slice(2); // Remove +1
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Return as-is for non-US or already formatted
  return phone;
}

/**
 * Validate phone number format
 *
 * @param phone - Phone number (will be normalized first)
 * @returns true if valid E.164 format after normalization
 */
export function isValidPhoneNumber(phone: string | null | undefined): boolean {
  return normalizePhoneNumber(phone) !== null;
}
