"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight, Phone, MapPin } from "lucide-react";
import { Logo } from "./ui";
import { business } from "@/lib/business";
const links = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Our Work", "/our-work"],
  ["About Us", "/about"],
  ["Contact", "/contact"],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const nodes = navRef.current?.querySelectorAll<HTMLElement>("a,button");
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handler);
    };
  }, [open]);
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>
            <MapPin size={12} /> ROOTED IN ALLENTOWN. FOCUSED ON YOUR PROPERTY.
          </span>
          <a href={business.phoneHref}>
            LET’S TALK <span className="topbar-phone">{business.phone}</span>
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
      <header className="header">
        <div className="container header-inner">
          <Logo />
          <nav aria-label="Main navigation" className="desktop-nav">
            {links.map(([name, url]) => (
              <Link
                key={url}
                href={url}
                aria-current={path === url ? "page" : undefined}
              >
                {name}
              </Link>
            ))}
          </nav>
          <Link href="/contact" className="header-cta">
            Request an Estimate <ArrowUpRight size={16} />
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="menu-toggle"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {open && (
        <nav
          ref={navRef}
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Mobile navigation"
        >
          {links.map(([name, url], i) => (
            <Link
              key={url}
              onClick={() => setOpen(false)}
              href={url}
              aria-current={path === url ? "page" : undefined}
            >
              <span>0{i + 1}</span>
              {name}
              <ArrowUpRight />
            </Link>
          ))}
          <a className="mobile-menu-phone" href={business.phoneHref}>
            <Phone size={18} />
            {business.phone}
          </a>
          <p>ALLENTOWN, GEORGIA · PROPERTY SERVICES</p>
        </nav>
      )}
    </>
  );
}
export function Footer({ isPreview }: { isPreview: boolean }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <Logo light />
            <p>
              One local company.
              <br />
              More possibilities for your property.
            </p>
            <a href={business.phoneHref} className="footer-phone">
              {business.phone}
              <ArrowUpRight size={17} />
            </a>
          </div>
          <div>
            <h4>Explore</h4>
            {links.map(([t, h]) => (
              <Link key={h} href={h}>
                {t}
              </Link>
            ))}
          </div>
          <div>
            <h4>Property services</h4>
            <Link href="/services#lawn-care">Lawn care & maintenance</Link>
            <Link href="/services#pressure-washing">Pressure washing</Link>
            <Link href="/services#junk-removal">Junk removal & hauling</Link>
          </div>
          <div className="footer-location">
            <h4>Local roots.</h4>
            <p>Allentown, Georgia</p>
            <span>
              Have a project nearby?
              <br />
              Let’s talk about your location.
            </span>
            <Link href="/contact" className="text-link">
              Start a conversation <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {business.name}
          </span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <span>
              {isPreview
                ? "Proposed website concept · Not the official company website"
                : "Property care, thoughtfully done."}
            </span>
          </div>
        </div>
        {isPreview && (
          <p className="photo-disclosure">
            Photography is illustrative and does not depict Georgia Pro
            Solutions projects.
          </p>
        )}
      </div>
    </footer>
  );
}
