import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Leaf,
  Droplets,
  Truck,
  MapPin,
  Plus,
} from "lucide-react";
import {
  Button,
  Photo,
  Eyebrow,
  ServiceCards,
  ClosingCTA,
  Process,
  ValueList,
} from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { Gallery } from "@/components/gallery";
import { gallery } from "@/lib/business";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <Eyebrow>ALLENTOWN, GEORGIA · PROPERTY SERVICES</Eyebrow>
            <h1>
              One call.
              <br />
              More <span>solutions.</span>
            </h1>
            <p>
              Good things happen when your property is in good hands. Lawn care,
              pressure washing, and junk removal—all with one local company.
            </p>
            <div className="hero-actions">
              <Button>Request an Estimate</Button>
              <Link className="plain-link" href="/services">
                Explore our services <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-footnote">
              <span className="small-mark">
                <MapPin size={17} />
              </span>
              <span>
                Local roots. A fresh approach.
                <small>Based in Allentown, Georgia</small>
              </span>
            </div>
          </div>
          <div className="hero-composition">
            <Photo
              className="hero-main-photo"
              src="/images/home-hero.jpg"
              alt="Illustrative sunlit home with a beautifully maintained green lawn"
              priority
            />
            <div className="hero-image-label">
              <span>PROPERTY CARE, FROM EVERY ANGLE.</span>
              <ArrowUpRight size={18} />
            </div>
            <div className="hero-inset">
              <Photo
                src="/images/pressure-washing.jpg"
                alt="Illustrative professional exterior surface cleaning"
                priority
              />
              <div>
                <Droplets size={17} />
                <span>A fresh start outside.</span>
              </div>
            </div>
            <div className="local-seal">
              <span>LOCAL SERVICE</span>
              <svg viewBox="0 0 50 50" fill="none" aria-hidden="true">
                <path
                  d="m16 4 15 4 2 10 6 9-4 6 3 11-29-2 3-15-3-12 7-11Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="m25 26 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"
                  fill="currentColor"
                />
              </svg>
              <span>GEORGIA PRO</span>
            </div>
          </div>
        </div>
      </section>
      <div className="service-ribbon">
        <div className="container">
          <span>
            <Leaf size={20} /> Lawn care & maintenance
          </span>
          <Plus size={14} />
          <span>
            <Droplets size={20} /> Pressure washing
          </span>
          <Plus size={14} />
          <span>
            <Truck size={20} /> Junk removal & hauling
          </span>
        </div>
      </div>
      <section className="section intro-section">
        <Reveal className="container intro-grid">
          <div>
            <Eyebrow>ONE COMPANY. A BETTER-KEPT PROPERTY.</Eyebrow>
            <h2>
              More off your list.
              <br />
              <span className="serif-accent">More out of your space.</span>
            </h2>
          </div>
          <div>
            <p className="large-copy">
              Your property has a lot of moving parts.
              <br />
              Taking care of it shouldn’t.
            </p>
            <p>
              From the lawn out front to the things taking up space, Georgia Pro
              Solutions brings practical property services together. Less
              searching. Fewer conversations to manage. More time to enjoy the
              place you call yours.
            </p>
            <Link className="text-link" href="/about">
              Get to know Georgia Pro <ArrowUpRight size={17} />
            </Link>
          </div>
        </Reveal>
      </section>
      <section className="section services-home">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <Eyebrow>WHAT WE CAN DO FOR YOU</Eyebrow>
              <h2>
                Three services.
                <br />
                One less thing to worry about.
              </h2>
            </div>
            <Button href="/services" variant="outline">
              View All Services
            </Button>
          </Reveal>
          <Reveal>
            <ServiceCards />
          </Reveal>
          <p className="image-caption">
            Illustrative service photography · Work scope is confirmed for each
            property.
          </p>
        </div>
      </section>
      <section className="why-section">
        <div className="why-image">
          <Photo
            src="/images/home-porch.jpg"
            alt="Illustrative welcoming home porch and landscaped outdoor space"
          />
          <div className="image-corner-label">
            <span>
              CARE FOR THE PLACE
              <br />
              YOU CALL YOURS.
            </span>
            <ArrowUpRight />
          </div>
        </div>
        <div className="why-copy">
          <Eyebrow>THE GEORGIA PRO APPROACH</Eyebrow>
          <h2>
            A little more care.
            <br />A lot less hassle.
          </h2>
          <p>
            Property upkeep is personal. It’s the view from your front door, the
            space you want back, and the to-do list you’re ready to finish.
          </p>
          <ValueList />
          <Button href="/about" variant="outline">
            Our Approach
          </Button>
        </div>
      </section>
      <section className="section featured">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <Eyebrow>GOOD-LOOKING SPACES. EVERYDAY POSSIBILITIES.</Eyebrow>
              <h2>
                The difference is
                <br />
                in the details.
              </h2>
            </div>
            <div>
              <p>A little inspiration for your next property refresh.</p>
              <Link className="text-link" href="/our-work">
                Explore the gallery <ArrowUpRight size={18} />
              </Link>
            </div>
          </Reveal>
          <Gallery items={gallery.slice(0, 3)} compact />
          <p className="image-caption">
            An illustrative look at property care. These are inspiration images,
            not completed company projects.
          </p>
        </div>
      </section>
      <Process />
      <section className="local-section">
        <div className="container local-grid">
          <div className="local-coordinate">
            <MapPin size={37} />
            <span>
              ALLENTOWN
              <br />
              <b>GEORGIA</b>
            </span>
          </div>
          <div>
            <Eyebrow>NEARBY, AND EASY TO REACH</Eyebrow>
            <h2>
              Local service.
              <br />A direct conversation.
            </h2>
            <p>
              No need to figure it all out before getting in touch. Tell Georgia
              Pro Solutions what your property needs, and start with a
              conversation about what’s possible.
            </p>
          </div>
          <Button href="/contact" variant="outline">
            Let’s Talk
          </Button>
        </div>
      </section>
      <ClosingCTA />
    </>
  );
}
