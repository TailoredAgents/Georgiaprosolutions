import { destroySession } from "@/lib/auth";
import { sameOrigin, json, apiError } from "@/lib/http";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    await destroySession();
    return json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
