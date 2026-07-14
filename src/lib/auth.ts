import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "rhark_admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.ADMIN_AUTH_SECRET;
  if (!secret) {
    throw new Error("ADMIN_AUTH_SECRET environment variable is not set");
  }
  return secret;
}

async function sign(data: string): Promise<string> {
  const secret = getSecret();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function verify(data: string, signature: string): Promise<boolean> {
  const secret = getSecret();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBytes = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
  try {
    return await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(data));
  } catch {
    return false;
  }
}

export function encodeSession(email: string, role: string, expiresAt: number): string {
  const payload = `${email}:${role}:${expiresAt}`;
  return `${btoa(payload)}`;
}

export async function signSession(encoded: string): Promise<string> {
  const signature = await sign(encoded);
  return `${encoded}.${signature}`;
}

export async function verifySession(cookieValue: string): Promise<{ email: string; role: string; expiresAt: number } | null> {
  try {
    const [encoded, signature] = cookieValue.split(".");
    if (!encoded || !signature) return null;

    const valid = await verify(encoded, signature);
    if (!valid) return null;

    const decoded = atob(encoded);
    const [email, role, expiresAtStr] = decoded.split(":");
    const expiresAt = parseInt(expiresAtStr, 10);

    if (Date.now() > expiresAt) return null;

    return { email, role, expiresAt };
  } catch {
    return null;
  }
}

export async function createSession(email: string, role: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const encoded = encodeSession(email, role, expiresAt);
  return await signSession(encoded);
}

export async function setSessionCookie(response: NextResponse, cookieValue: string): Promise<void> {
  response.cookies.set(SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE);
}

export async function getSessionFromRequest(request: NextRequest): Promise<{ email: string; role: string } | undefined> {
  const cookieValue = request.cookies.get(SESSION_COOKIE)?.value;
  if (!cookieValue) return undefined;
  const session = await verifySession(cookieValue);
  if (!session) return undefined;
  return { email: session.email, role: session.role };
}

export async function requireAuth(request: NextRequest): Promise<{ email: string; role: string } | Response> {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return session;
}
