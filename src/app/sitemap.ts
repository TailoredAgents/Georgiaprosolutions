import type { MetadataRoute } from "next";
import { preview, siteUrl } from "@/lib/business";
export default function sitemap(): MetadataRoute.Sitemap {
  return preview || process.env.ALLOW_INDEXING !== "true"
    ? []
    : ["", "/services", "/our-work", "/about", "/contact"].map((p) => ({
        url: siteUrl + p,
        lastModified: new Date(),
      }));
}
