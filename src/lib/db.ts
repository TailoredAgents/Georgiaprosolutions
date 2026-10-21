import "server-only";
import { Pool } from "pg";
const globalDb = globalThis as unknown as { gpsPool?: Pool };
export function db() {
  if (!process.env.DATABASE_URL) throw new Error("Database is not configured");
  if (!globalDb.gpsPool) {
    globalDb.gpsPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
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
    globalDb.gpsPool.on("error", () =>
      console.error("Database connection unavailable"),
    );
  }
  return globalDb.gpsPool;
}
