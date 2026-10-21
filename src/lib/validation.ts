import { z } from "zod";
export const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .min(10)
    .max(30)
    .regex(/^[+0-9() .-]+$/)
    .refine((s) => s.replace(/\D/g, "").length >= 10),
  email: z.email().max(254),
  service: z.enum(["lawn-care", "pressure-washing", "junk-removal", "other"]),
  location: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal("yes"),
  website: z.string().max(200).optional().default(""),
  startedAt: z.number().finite(),
});
export const eventSchema = z.object({
  consent: z.literal(true),
  type: z.literal("pageview"),
  path: z.enum([
    "/",
    "/services",
    "/our-work",
    "/about",
    "/contact",
    "/privacy",
  ]),
  visitorId: z.uuid(),
  visitId: z.uuid(),
  referrer: z.string().max(255).optional(),
  utmSource: z.string().max(100).nullable().optional(),
  device: z.enum(["mobile", "tablet", "desktop"]),
});
export function referralCategory(
  referrer: string | undefined,
  utm: string | null | undefined,
) {
  if (utm) {
    const known = [
      "google",
      "bing",
      "facebook",
      "instagram",
      "newsletter",
      "email",
    ];
    return known.includes(utm.toLowerCase())
      ? utm.toLowerCase()
      : "other-campaign";
  }
  if (!referrer || referrer === "direct") return "direct";
  if (/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com)$/.test(referrer))
    return "search";
  if (
    /(^|\.)(facebook\.com|instagram\.com|t\.co|linkedin\.com)$/.test(referrer)
  )
    return "social";
  return "referral";
}
