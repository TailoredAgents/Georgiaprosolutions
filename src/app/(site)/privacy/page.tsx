import { Eyebrow } from "@/components/ui";
import { preview } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "How estimate requests and optional anonymous analytics are handled.",
  path: "/privacy",
});
export default function Privacy() {
  return (
    <section className="section privacy-page">
      <div className="container prose">
        <Eyebrow>YOUR INFORMATION</Eyebrow>
        <h1>
          Privacy,
          <br />
          <span>in plain language.</span>
        </h1>
        <p className="large-copy">
          {preview
            ? "This is a proposed website concept. Preview estimate submissions are validated, then discarded. They are not stored or emailed."
            : "Your contact details are used to respond to your property-service inquiry."}
        </p>
        <h2>Estimate requests</h2>
        <p>
          When this site is activated for the business, the estimate form stores
          your name, phone, email, property location, selected service, and
          message in a private database for the administrator to review.
          Configured email notifications may include your name and service with
          a link to the private dashboard. Notification delivery is separate
          from saving a request. Please do not submit sensitive financial or
          personal documents.
        </p>
        <h2>Optional visit measurement</h2>
        <p>
          Anonymous analytics are off in the preview. When enabled, analytics
          require your choice to allow them and respect the browser’s Do Not
          Track signal. They use random browser and visit identifiers, page
          paths, general device categories, and sanitized referral/source
          categories. Raw IP addresses and inquiry text are not stored in
          analytics. You can remove the stored choice using the button below or
          your browser’s site-data settings.
        </p>
        <h2>Retention and access</h2>
        <p>
          Production analytics default to 90 days and inquiries to 365 days,
          configurable by the site operator. Inquiry records are separate from
          anonymous events and are accessible only through the protected
          administrator area. Administrator sessions expire after eight hours.
        </p>
        <h2>Questions or removal requests</h2>
        <p>
          Contact Georgia Pro Solutions at{" "}
          <a href="tel:+14784847213">(478) 484-7213</a> about information held
          by the business. The commissioning agency must confirm the business’s
          privacy contact and retention needs before public activation.
        </p>
        <PrivacyReset />
      </div>
    </section>
  );
}
import { PrivacyReset } from "@/components/privacy-reset";
