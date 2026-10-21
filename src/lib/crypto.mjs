import {
  scrypt as scryptCallback,
  randomBytes,
  timingSafeEqual,
  createHash,
  createHmac,
} from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCallback);
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64, {
    N: 32768,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  });
  return `scrypt:32768:8:1:${salt}:${key.toString("hex")}`;
}
export async function verifyPassword(password, encoded) {
  try {
    const [method, n, r, p, salt, hex] = encoded.split(/[$:]/);
    if (
      method !== "scrypt" ||
      n !== "32768" ||
      r !== "8" ||
      p !== "1" ||
      !/^[a-f0-9]{32}$/.test(salt) ||
      !/^[a-f0-9]{128}$/.test(hex)
    )
      return false;
    const key = await scrypt(password, salt, 64, {
      N: 32768,
      r: 8,
      p: 1,
      maxmem: 64 * 1024 * 1024,
    });
    return timingSafeEqual(key, Buffer.from(hex, "hex"));
  } catch {
    return false;
  }
}
export function token() {
  return randomBytes(32).toString("base64url");
}
export function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}
export function keyedDigest(value, secret) {
  return createHmac("sha256", secret).update(value).digest("hex");
}
export function safeEqual(a, b) {
  const x = digest(a),
    y = digest(b);
  return timingSafeEqual(Buffer.from(x), Buffer.from(y));
}
export function csvCell(value) {
  let text = String(value ?? "");
  if (/^[\s]*[=+@\-\t\r]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
