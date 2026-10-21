import { db } from "@/lib/db";
import { preview, siteUrl } from "@/lib/business";
import { inquirySchema } from "@/lib/validation";
import { sameOrigin, readJson, json, apiError, HttpError } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    if (!(await rateLimit(request, "inquiry", 8, 900)))
      throw new HttpError(
        429,
        "Too many requests. Please try again later or call the company.",
      );
    const parsed = inquirySchema.safeParse(await readJson(request));
    if (!parsed.success)
      throw new HttpError(
        400,
        "Please check your name, phone, email, location, service, and project description.",
      );
    const data = parsed.data;
    if (
      data.website ||
      Date.now() - data.startedAt < 1500 ||
      data.startedAt > Date.now()
    )
      throw new HttpError(
        400,
        "Please take a moment to review the form and try again.",
      );
    if (preview)
      return json({ ok: true, preview: true, stored: false, emailSent: false });
    if (!process.env.DATABASE_URL)
      throw new HttpError(
        503,
        "Online requests are not available yet. Please call (478) 484-7213.",
      );
    const client = await db().connect();
    let id: string;
    try {
      await client.query("BEGIN");
      const r = await client.query(
        "INSERT INTO inquiries(name,phone,email,service,location,message) VALUES($1,$2,$3,$4,$5,$6) RETURNING id",
        [
          data.name,
          data.phone,
          data.email,
          data.service,
          data.location,
          data.message,
        ],
      );
      id = r.rows[0].id;
      await client.query(
        "INSERT INTO analytics_events(event_type,path) VALUES('inquiry','/contact')",
      );
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
    let emailSent = false;
    if (
      process.env.RESEND_API_KEY &&
      process.env.NOTIFICATION_TO &&
      process.env.NOTIFICATION_FROM
    ) {
      try {
        const result = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.NOTIFICATION_FROM,
            to: [process.env.NOTIFICATION_TO],
            subject: "New Georgia Pro Solutions estimate request",
            text: `A new ${data.service} request was received. Review contact details securely at ${siteUrl}/admin. Request reference: ${id}`,
          }),
          signal: AbortSignal.timeout(8000),
        });
        emailSent = result.ok;
        await db().query(
          "UPDATE inquiries SET notification_status=$1 WHERE id=$2",
          [emailSent ? "sent" : "failed", id],
        );
      } catch {
        try {
          await db().query(
            "UPDATE inquiries SET notification_status='failed' WHERE id=$1",
            [id],
          );
        } catch {}
      }
    }
    return json({ ok: true, preview: false, stored: true, emailSent });
  } catch (error) {
    return apiError(
      error,
      "Your request could not be saved. Please call (478) 484-7213 or try again later.",
    );
  }
}
