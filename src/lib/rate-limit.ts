import "server-only";
import { db } from "./db";
import { keyedDigest, token } from "./crypto.mjs";
import { preview } from "./business";
const state = globalThis as unknown as {
  gpsLimits?: Map<string, { count: number; expires: number }>;
  gpsRateSecret?: string;
};
state.gpsLimits ??= new Map();
state.gpsRateSecret ??= token();
export async function rateLimit(
  request: Request,
  scope: string,
  limit: number,
  seconds = 900,
  account = false,
) {
  const secret = process.env.SESSION_SECRET || state.gpsRateSecret!;
  // The account bucket prevents IP-header spoofing from bypassing the single-admin login limit.
  const identity = account
    ? "one-administrator"
    : process.env.TRUST_PROXY === "true"
      ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
      : "shared-client";
  const key = keyedDigest(`${scope}:${identity}`, secret);
  if (!preview) {
    const result = await db().query(
      `INSERT INTO rate_limits (key,count,expires_at) VALUES ($1,1,NOW()+$2*INTERVAL '1 second') ON CONFLICT (key) DO UPDATE SET count=CASE WHEN rate_limits.expires_at<NOW() THEN 1 ELSE rate_limits.count+1 END, expires_at=CASE WHEN rate_limits.expires_at<NOW() THEN NOW()+$2*INTERVAL '1 second' ELSE rate_limits.expires_at END RETURNING count`,
      [key, seconds],
    );
    return result.rows[0].count <= limit;
  }
  const map = state.gpsLimits!;
  const now = Date.now();
  for (const [k, v] of map) if (v.expires < now) map.delete(k);
  let entry = map.get(key);
  if (!entry || entry.expires < now) {
    entry = { count: 0, expires: now + seconds * 1000 };
    map.set(key, entry);
  }
  entry.count++;
  return entry.count <= limit;
}
