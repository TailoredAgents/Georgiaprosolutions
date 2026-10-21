import { authorized } from "@/lib/auth";
import { getDashboard } from "@/lib/dashboard";
import { csvCell } from "@/lib/crypto.mjs";
import { json, apiError, HttpError } from "@/lib/http";
export async function GET(request: Request) {
  try {
    if (!(await authorized())) throw new HttpError(401, "Please sign in.");
    const p = new URL(request.url).searchParams;
    const days = Number(p.get("days") || 30);
    if (![7, 30, 90].includes(days))
      throw new HttpError(400, "Invalid date range.");
    const mode = p.get("mode") === "sample" ? "sample" : "live";
    const d = await getDashboard(days, mode);
    const rows = [
      [
        "Name",
        "Phone",
        "Email",
        "Service",
        "Location",
        "Message",
        "Status",
        "Submitted (UTC)",
        "Data mode",
      ],
      ...d.inquiries.map((i) => [
        i.name,
        i.phone,
        i.email,
        i.service,
        i.location,
        i.message,
        i.status,
        i.created_at,
        mode === "sample" ? "ILLUSTRATIVE SAMPLE" : "LIVE",
      ]),
    ];
    const csv =
      "\uFEFF" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="georgia-pro-${mode}-inquiries-${days}days.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof HttpError)
      return json({ error: error.message }, error.status);
    return apiError(error);
  }
}
