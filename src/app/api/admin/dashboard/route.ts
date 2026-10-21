import { authorized } from "@/lib/auth";
import { getDashboard } from "@/lib/dashboard";
import { json, apiError, HttpError } from "@/lib/http";
export async function GET(request: Request) {
  try {
    if (!(await authorized())) throw new HttpError(401, "Please sign in.");
    const params = new URL(request.url).searchParams;
    const days = Number(params.get("days") || 30);
    if (![7, 30, 90].includes(days))
      throw new HttpError(400, "Choose 7, 30, or 90 days.");
    const mode = params.get("mode");
    if (mode !== "sample" && mode !== "live")
      throw new HttpError(400, "Choose a valid data mode.");
    return json(await getDashboard(days, mode));
  } catch (error) {
    return apiError(error);
  }
}
