import { readFile, readdir } from "node:fs/promises";
import { pool } from "./database.mjs";
import { digest } from "../src/lib/crypto.mjs";
const db = pool();
const client = await db.connect();
try {
  await client.query("SELECT pg_advisory_lock(774112)");
  await client.query(
    "CREATE TABLE IF NOT EXISTS schema_migrations(name TEXT PRIMARY KEY,checksum CHAR(64) NOT NULL,applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())",
  );
  const files = (await readdir("migrations"))
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const name of files) {
    const sql = await readFile(`migrations/${name}`, "utf8");
    const checksum = digest(sql);
    const prior = await client.query(
      "SELECT checksum FROM schema_migrations WHERE name=$1",
      [name],
    );
    if (prior.rows.length) {
      if (prior.rows[0].checksum !== checksum)
        throw new Error(`Migration ${name} has changed since application.`);
      continue;
    }
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query(
        "INSERT INTO schema_migrations(name,checksum) VALUES($1,$2)",
        [name, checksum],
      );
      await client.query("COMMIT");
      console.log(`Applied ${name}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
  console.log("Database migrations are current.");
} finally {
  await client.query("SELECT pg_advisory_unlock(774112)");
  client.release();
  await db.end();
}
