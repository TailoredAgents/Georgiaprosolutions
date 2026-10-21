import "server-only";
import { cookies } from "next/headers";
import { db } from "./db";
import { preview } from "./business";
import { token, keyedDigest, digest } from "./crypto.mjs";
const state = globalThis as unknown as {
  gpsSessions?: Map<string, { expires: number; version: string }>;
};
state.gpsSessions ??= new Map();
export const cookieName =
  process.env.NODE_ENV === "production" ? "__Host-gps_session" : "gps_session";
const hours = 8;
export function authConfigured() {
  return Boolean(
    process.env.ADMIN_EMAIL &&
    process.env.ADMIN_PASSWORD_HASH &&
    process.env.SESSION_SECRET &&
    process.env.SESSION_SECRET.length >= 32,
  );
}
function version() {
  return digest(
    `${process.env.ADMIN_EMAIL}:${process.env.ADMIN_PASSWORD_HASH}`,
  );
}
function sessionHash(value: string) {
  return keyedDigest(value, process.env.SESSION_SECRET!);
}
export async function createSession() {
  if (!authConfigured()) throw new Error("Admin is not configured");
  const raw = token();
  const hashed = sessionHash(raw);
  const expires = new Date(Date.now() + hours * 3600000);
  if (preview) {
    for (const [k, v] of state.gpsSessions!)
      if (v.expires < Date.now()) state.gpsSessions!.delete(k);
    state.gpsSessions!.set(hashed, {
      expires: expires.getTime(),
      version: version(),
    });
  } else {
    await db().query(
      "INSERT INTO admin_sessions(token_hash,expires_at,credential_version) VALUES($1,$2,$3)",
      [hashed, expires, version()],
    );
  }
  (await cookies()).set(cookieName, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: hours * 3600,
  });
}
export async function authorized() {
  if (!authConfigured()) return false;
  const raw = (await cookies()).get(cookieName)?.value;
  if (!raw || !/^[A-Za-z0-9_-]{43}$/.test(raw)) return false;
  const hashed = sessionHash(raw);
  if (preview) {
    const session = state.gpsSessions!.get(hashed);
    return Boolean(
      session && session.expires > Date.now() && session.version === version(),
    );
  }
  try {
    const r = await db().query(
      "SELECT 1 FROM admin_sessions WHERE token_hash=$1 AND expires_at>NOW() AND credential_version=$2",
      [hashed, version()],
    );
    return r.rowCount === 1;
  } catch {
    return false;
  }
}
export async function destroySession() {
  const jar = await cookies();
  const raw = jar.get(cookieName)?.value;
  if (raw && authConfigured()) {
    const hashed = sessionHash(raw);
    if (preview) state.gpsSessions!.delete(hashed);
    else
      await db().query("DELETE FROM admin_sessions WHERE token_hash=$1", [
        hashed,
      ]);
  }
  jar.set(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
