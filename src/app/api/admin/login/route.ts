import { z } from "zod";
import { authConfigured, createSession } from "@/lib/auth";
import { verifyPassword, safeEqual } from "@/lib/crypto.mjs";
import { sameOrigin, readJson, json, apiError, HttpError } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    if (!authConfigured())
      throw new HttpError(
        503,
        "Administrator access has not been configured. Use the administrator setup command.",
      );
    if (!(await rateLimit(request, "login", 10, 900, true)))
      throw new HttpError(
        429,
        "Too many sign-in attempts. Please wait 15 minutes.",
      );
    const parsed = z
      .object({
        email: z.email().max(254),
        password: z.string().min(1).max(256),
      })
      .safeParse(await readJson(request, 2000));
    if (!parsed.success)
      throw new HttpError(400, "Enter a valid email address and password.");
    const validPassword = await verifyPassword(
      parsed.data.password,
      process.env.ADMIN_PASSWORD_HASH!,
    );
    const validEmail = safeEqual(
      parsed.data.email.trim().toLowerCase(),
      process.env.ADMIN_EMAIL!.trim().toLowerCase(),
    );
    if (!validPassword || !validEmail)
      throw new HttpError(401, "Email or password is incorrect.");
    await createSession();
    return json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
