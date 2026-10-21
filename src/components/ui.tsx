import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  Phone,
  MapPin,
  Leaf,
  Droplets,
  Truck,
  Check,
  MessageCircle,
  SlidersHorizontal,
  ScanLine,
} from "lucide-react";
import { business, services } from "@/lib/business";
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      className={`logo ${light ? "logo-light" : ""}`}
      href="/"
      aria-label="Georgia Pro Solutions home"
    >
      <svg viewBox="0 0 42 44" fill="none" aria-hidden="true">
        <path
          d="M5 12 21 3l16 9v19l-16 10L5 31V12Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="m13 17 8-5 8 5-8 5-8-5Zm0 9 8 5 8-5M21 22v9"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
      <span>
        GEORGIA PRO<small>S O L U T I O N S</small>
      </span>
    </Link>
  );
}
export function Button({
  children,
  href = "/contact",
  variant = "",
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`button ${variant} ${className}`}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}
export function Photo({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`photo ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={85}
      />
    </div>
  );
}
export function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`eyebrow ${light ? "light" : ""}`}>
      <span />
      {children}
    </p>
  );
}
export function ServiceIcon({ id, size = 25 }: { id: string; size?: number }) {
  return id === "lawn-care" ? (
    <Leaf size={size} />
  ) : id === "pressure-washing" ? (
    <Droplets size={size} />
  ) : (
    <Truck size={size} />
  );
}
export function ServiceCards() {
  return (
    <div className="service-grid">
      {services.map((s) => (
        <Link href={`/services#${s.id}`} className="service-card" key={s.id}>
          <div className="service-photo">
            <Photo src={s.image} alt={s.alt} />
            <span className="service-number">{s.number} /</span>
            <span className="circle-arrow">
              <ArrowUpRight size={22} />
            </span>
          </div>
          <div className="service-card-body">
            <ServiceIcon id={s.id} />
            <h3>{s.title}</h3>
            <p>{s.description}</p>
            <span className="text-link">
              Explore {s.short.toLowerCase()} <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function ClosingCTA() {
  return (
    <section className="closing">
      <div className="closing-pattern" aria-hidden="true" />
      <div className="container closing-inner">
        <div>
          <Eyebrow light>A BETTER-LOOKING PROPERTY STARTS HERE</Eyebrow>
          <h2>
            Let’s get your property
            <br />
            looking its best.
          </h2>
          <p>
            A fresh lawn. A cleaner exterior. A little more space.
            <br className="desktop-break" /> Tell us what you have in mind.
          </p>
        </div>
        <div className="closing-actions">
          <Button>Request an Estimate</Button>
          <a href={business.phoneHref} className="phone-link">
            <Phone size={17} />
            {business.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
export function Process() {
  return (
    <section className="section process-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <Eyebrow>LESS HASSLE. MORE PROGRESS.</Eyebrow>
            <h2>
              Good service starts
              <br />
              with a simple conversation.
            </h2>
          </div>
          <p>
            From the first question to the finishing details,
            <br className="desktop-break" /> here’s how to get started.
          </p>
        </div>
        <div className="process-grid">
          {[
            {
              n: "01",
              t: "Tell us what you need",
              d: "A lawn that needs attention? An exterior refresh? Something that needs to go? Start with the details.",
              Icon: MessageCircle,
            },
            {
              n: "02",
              t: "Discuss the details",
              d: "Talk through your property, the scope of work, and availability. Find an approach that fits.",
              Icon: SlidersHorizontal,
            },
            {
              n: "03",
              t: "Get the job done",
              d: "Agree on the work and make a plan to give your property the attention it deserves.",
              Icon: Check,
            },
          ].map((s) => (
            <div className="process-step" key={s.n}>
              <div className="step-top">
                <s.Icon size={24} />
                <span>{s.n}</span>
              </div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function LocationNote() {
  return (
    <div className="location-note">
      <MapPin size={16} />
      <span>
        Based in Allentown, Georgia <b>·</b> Ask about service at your address
      </span>
    </div>
  );
}
export function ValueList() {
  return (
    <div className="value-list">
      {[
        {
          icon: SlidersHorizontal,
          t: "Your property. Your priorities.",
          d: "Start with the areas you want to improve and build the scope around them.",
        },
        {
          icon: ScanLine,
          t: "The details make the difference.",
          d: "A considered approach to the small things that make a space feel cared for.",
        },
        {
          icon: MessageCircle,
          t: "A conversation, not a complication.",
          d: "Discuss your needs directly and know what the next step looks like.",
        },
      ].map((v) => (
        <div key={v.t}>
          <v.icon size={24} />
          <span>
            <h3>{v.t}</h3>
            <p>{v.d}</p>
          </span>
        </div>
      ))}
    </div>
  );
}
