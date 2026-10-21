import { Pool } from "pg";
import { readFile } from "node:fs/promises";
for (const file of [".env.local", ".env"]) {
  try {
    const raw = await readFile(file, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match && !process.env[match[1]])
        process.env[match[1]] = match[2]
          .replace(/^['"]|['"]$/g, "")
          .replaceAll("\\$", "$");
    }
  } catch {}
}
export function pool() {
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL first.");
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    ssl:
      process.env.DATABASE_SSL === "true"
        ? {
            rejectUnauthorized: true,
            ...(process.env.DATABASE_CA
              ? { ca: process.env.DATABASE_CA.replace(/\\n/g, "\n") }
              : {}),
          }
        : undefined,
  });
}
