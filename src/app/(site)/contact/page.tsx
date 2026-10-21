import { pageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { Phone, MapPin, ArrowUpRight, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Eyebrow, Photo } from "@/components/ui";
import { business, preview } from "@/lib/business";
export const metadata = pageMetadata({
  title: "Request a Property Service Estimate",
  description:
    "Tell Georgia Pro Solutions about your property. Request lawn care, pressure washing, or junk removal in the Allentown, Georgia area.",
  path: "/contact",
});
export default function Contact() {
  return (
    <section className="contact-page">
      <div className="container">
        <div className="contact-heading">
          <Eyebrow>LET’S TAKE SOMETHING OFF YOUR LIST</Eyebrow>
          <h1>
            Good things start
            <br />
            with <span>a conversation.</span>
          </h1>
          <p>Tell us what your property needs. We’ll take it from there.</p>
        </div>
        <div className="contact-layout">
          <aside className="contact-aside">
            <div className="contact-card">
              <span className="contact-icon">
                <Phone size={24} />
              </span>
              <small>PREFER TO TALK?</small>
              <a href={business.phoneHref}>
                {business.phone}
                <ArrowUpRight size={20} />
              </a>
              <p>A direct line to Georgia Pro Solutions.</p>
              <div className="contact-location">
                <MapPin size={21} />
                <div>
                  <strong>Allentown, Georgia</strong>
                  <p>
                    Share your location to confirm service availability at your
                    address.
                  </p>
                </div>
              </div>
            </div>
            <Photo
              className="contact-photo"
              src="/images/home-porch.jpg"
              alt="Illustrative cared-for home and welcoming front porch"
            />
            <div className="contact-tip">
              <MessageCircle size={22} />
              <p>
                Not sure which service fits?
                <br />
                <strong>Tell us what you have in mind.</strong>
              </p>
            </div>
          </aside>
          <Suspense
            fallback={
              <div className="estimate-form">Loading estimate form…</div>
            }
          >
            <ContactForm preview={preview} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
