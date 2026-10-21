import { z } from "zod";
import { authorized } from "@/lib/auth";
import { db } from "@/lib/db";
import { preview } from "@/lib/business";
import { sameOrigin, readJson, json, apiError, HttpError } from "@/lib/http";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    sameOrigin(request);
    if (!(await authorized())) throw new HttpError(401, "Please sign in.");
    if (preview)
      throw new HttpError(
        403,
        "Live inquiry changes are disabled in preview mode.",
      );
    const { id } = await params;
    if (!z.uuid().safeParse(id).success)
      throw new HttpError(400, "Invalid inquiry.");
    const parsed = z
      .object({ status: z.enum(["new", "contacted", "scheduled", "closed"]) })
      .safeParse(await readJson(request, 1000));
    if (!parsed.success) throw new HttpError(400, "Invalid lead status.");
    const result = await db().query(
      "UPDATE inquiries SET status=$1 WHERE id=$2 RETURNING id,status",
      [parsed.data.status, id],
    );
    if (!result.rowCount) throw new HttpError(404, "Inquiry not found.");
    return json(result.rows[0]);
  } catch (error) {
    return apiError(error);
  }
}
