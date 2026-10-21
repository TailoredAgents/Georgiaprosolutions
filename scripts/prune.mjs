import { pool } from "./database.mjs";
const analytics = Math.min(
  730,
  Math.max(1, Number(process.env.ANALYTICS_RETENTION_DAYS) || 90),
);
const inquiries = Math.min(
  3650,
  Math.max(1, Number(process.env.INQUIRY_RETENTION_DAYS) || 365),
);
const db = pool();
try {
  const results = await Promise.all([
    db.query(
      "DELETE FROM analytics_events WHERE created_at < NOW()-$1*INTERVAL '1 day'",
      [analytics],
    ),
    db.query(
      "DELETE FROM inquiries WHERE created_at < NOW()-$1*INTERVAL '1 day'",
      [inquiries],
    ),
    db.query("DELETE FROM admin_sessions WHERE expires_at < NOW()"),
    db.query("DELETE FROM rate_limits WHERE expires_at < NOW()"),
  ]);
  console.log(
    `Retention complete: ${results.map((r) => r.rowCount).join(", ")} expired events, inquiries, sessions, and limit records removed.`,
  );
} finally {
  await db.end();
}
