import { business, preview, siteUrl } from "@/lib/business";
export function BusinessSchema() {
  if (preview || process.env.BUSINESS_DETAILS_APPROVED !== "true") return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    telephone: business.phone,
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Allentown",
      addressRegion: "GA",
      addressCountry: "US",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
