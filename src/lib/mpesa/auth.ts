/**
 * M-Pesa Daraja OAuth authentication.
 *
 * Retrieves an access token from the Safaricom Daraja API using the
 * consumer key and secret.
 */

import { getMpesaConfig } from "./config";

export interface MpesaTokenResponse {
  access_token: string;
  expires_in: string;
}

/**
 * Get a valid M-Pesa access token.
 *
 * In production, you should cache the token to avoid hitting the OAuth
 * endpoint on every STK Push request.
 */
export async function getMpesaAccessToken(): Promise<string> {
  const config = getMpesaConfig();

  if (!config) {
    throw new Error("M-Pesa is not configured");
  }

  const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
  const baseUrl = config.environment === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[M-Pesa Auth] Failed to get access token:", response.status, errorText);
    throw new Error(`Failed to get M-Pesa access token: ${response.status}`);
  }

  const data: MpesaTokenResponse = await response.json();
  return data.access_token;
}
