import type { MetadataRoute } from "next";
import { preview, siteUrl } from "@/lib/business";
export default function robots(): MetadataRoute.Robots {
  return preview || process.env.ALLOW_INDEXING !== "true"
    ? { rules: { userAgent: "*", disallow: "/" } }
    : {
        rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
        sitemap: `${siteUrl}/sitemap.xml`,
      };
}
