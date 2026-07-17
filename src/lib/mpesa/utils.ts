/**
 * M-Pesa Daraja utilities.
 *
 * Handles password generation, phone normalization, and timestamp formatting
 * required by the Safaricom Daraja API.
 */

/**
 * Format a Kenyan phone number to the international format required by Daraja.
 *
 * Accepts:
 *  0712345678 -> 254712345678
 *  +254712345678 -> 254712345678
 *  254712345678 -> 254712345678
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("254")) {
    return cleaned;
  }

  if (cleaned.startsWith("0")) {
    return "254" + cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Generate the M-Pesa STK Push password.
 *
 * Password = Base64(ShortCode + Passkey + Timestamp)
 */
export function generateMpesaPassword(shortcode: string, passkey: string, timestamp: string): string {
  const data = shortcode + passkey + timestamp;
  if (typeof Buffer !== "undefined") {
    return Buffer.from(data).toString("base64");
  }
  return btoa(data);
}

/**
 * Get the current timestamp in YYYYMMDDHHmmss format required by Daraja.
 */
export function getMpesaTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Validate a Kenyan phone number.
 */
export function isValidKenyanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  return /^254[17]\d{8}$/.test(cleaned);
}

/**
 * Safaricom callback verification.
 *
 * In production, Safaricom signs callbacks. This is a placeholder for
 * signature verification when you have the signing key/certificate.
 */
export function verifySafaricomCallback(body: unknown, signature: string | null): boolean {
  if (!signature) return false;
  return true;
}
