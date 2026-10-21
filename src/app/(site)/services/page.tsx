import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";
import {
  Button,
  Photo,
  Eyebrow,
  ClosingCTA,
  ServiceIcon,
  LocationNote,
} from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { services } from "@/lib/business";
export const metadata: Metadata = {
  title: "Property Services",
  description:
    "Explore lawn care, pressure washing, and junk removal with Georgia Pro Solutions in Allentown, Georgia.",
  alternates: { canonical: "/services" },
};
const faqs = [
  [
    "Where do you provide service?",
    "Georgia Pro Solutions is based in Allentown, Georgia. Share your property address or ZIP code when you get in touch so service availability can be confirmed.",
  ],
  [
    "Can I ask about more than one service?",
    "Yes. Include the different areas you need help with in your request. Scope and availability are discussed for your property.",
  ],
  [
    "How do I request an estimate?",
    "Use the estimate form or call (478) 484-7213. Include your location, the service you are interested in, and a short description. Pricing and scheduling are confirmed directly.",
  ],
  [
    "What can be hauled away?",
    "Describe the items you want removed and how they can be accessed. Accepted materials and removal arrangements must be confirmed before scheduling. Do not assume hazardous or specialized materials are accepted.",
  ],
];
export default function Services() {
  return (
    <>
      <section className="page-hero services-hero">
        <div className="container">
          <Eyebrow>A FRESH APPROACH TO PROPERTY CARE</Eyebrow>
          <div className="page-hero-split">
            <h1>
              Your property.
              <br />
              Our kind of <span>work.</span>
            </h1>
            <div>
              <p>
                From the everyday upkeep to the long-overdue cleanup. Find the
                right help for your next project.
              </p>
              <LocationNote />
            </div>
          </div>
          <div className="service-jump">
            {services.map((s) => (
              <a href={`#${s.id}`} key={s.id}>
                <span>{s.number}</span>
                {s.short}
                <ArrowDownRight size={21} />
              </a>
            ))}
          </div>
        </div>
      </section>
      <div className="container service-details">
        {services.map((s) => (
          <Reveal key={s.id}>
            <section
              id={s.id}
              className={`service-detail service-detail-${s.number}`}
            >
              <div className="service-detail-image">
                <Photo src={s.image} alt={s.alt} />
                <span className="photo-index">
                  {s.number}
                  <small> / PROPERTY SERVICES</small>
                </span>
              </div>
              <div className="service-detail-copy">
                <div className="service-overline">
                  <ServiceIcon id={s.id} />
                  <span>{s.short}</span>
                </div>
                <h2>{s.tagline}</h2>
                <p>{s.detail}</p>
                <ul>
                  {s.benefits.map((b) => (
                    <li key={b}>
                      <Check size={16} />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button href={`/contact?service=${s.id}`}>{s.prompt}</Button>
                <div className="related-services">
                  <span>ALSO EXPLORE</span>
                  {services
                    .filter((a) => a.id !== s.id)
                    .map((a) => (
                      <Link key={a.id} href={`#${a.id}`}>
                        {a.short}
                        <ArrowUpRight size={14} />
                      </Link>
                    ))}
                </div>
              </div>
            </section>
          </Reveal>
        ))}
      </div>
      <section className="section faq-section">
        <div className="container faq-grid">
          <div>
            <Eyebrow>A FEW GOOD QUESTIONS</Eyebrow>
            <h2>
              Before we
              <br />
              get started.
            </h2>
            <p>
              Have something else in mind?
              <br />
              <Link href="/contact" className="text-link">
                Just ask us <ArrowUpRight size={16} />
              </Link>
            </p>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Plus size={20} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <ClosingCTA />
    </>
  );
}
