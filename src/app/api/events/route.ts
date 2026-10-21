import { preview } from "@/lib/business";
import { db } from "@/lib/db";
import { sameOrigin, readJson, json } from "@/lib/http";
import { eventSchema, referralCategory } from "@/lib/validation";
import { keyedDigest } from "@/lib/crypto.mjs";
import { rateLimit } from "@/lib/rate-limit";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    if (
      preview ||
      process.env.ANALYTICS_ENABLED !== "true" ||
      request.headers.get("dnt") === "1"
    )
      return json({ collected: false });
    if (
      !process.env.SESSION_SECRET ||
      !(await rateLimit(request, "events", 180, 60))
    )
      return json({ collected: false });
    const parsed = eventSchema.safeParse(await readJson(request, 3000));
    if (!parsed.success) return json({ collected: false }, 400);
    const data = parsed.data;
    const month = new Date().toISOString().slice(0, 7);
    const visitor = keyedDigest(
      `${month}:${data.visitorId}`,
      process.env.SESSION_SECRET,
    );
    const visit = keyedDigest(data.visitId, process.env.SESSION_SECRET);
    const ownHost = new URL(process.env.SITE_URL || request.url).hostname;
    const source =
      data.referrer === ownHost && !data.utmSource
        ? "internal"
        : referralCategory(data.referrer, data.utmSource);
    await db().query(
      "INSERT INTO analytics_events(event_type,path,visitor_hash,visit_hash,source,device) VALUES('pageview',$1,$2,$3,$4,$5)",
      [data.path, visitor, visit, source, data.device],
    );
    return json({ collected: true });
  } catch {
    return json({ collected: false });
  }
}
