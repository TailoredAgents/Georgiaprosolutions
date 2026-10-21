import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./ui";
import { business } from "@/lib/business";
const links = [
  ["Home", "/"],
  ["Services", "/services"],
  ["Our Work", "/our-work"],
  ["About Us", "/about"],
  ["Contact", "/contact"],
];
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
            <h2 className="footer-heading">Explore</h2>
            {links.map(([t, h]) => (
              <Link key={h} href={h}>
                {t}
              </Link>
            ))}
          </div>
          <div>
            <h2 className="footer-heading">Property services</h2>
            <Link href="/services#lawn-care">Lawn care & maintenance</Link>
            <Link href="/services#pressure-washing">Pressure washing</Link>
            <Link href="/services#junk-removal">Junk removal & hauling</Link>
          </div>
          <div className="footer-location">
            <h2 className="footer-heading">Local roots.</h2>
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
