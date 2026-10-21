import type { Metadata } from "next";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Eyebrow, Photo, Button, ClosingCTA, ValueList } from "@/components/ui";
import { Reveal } from "@/components/reveal";
export const metadata: Metadata = {
  title: "About Us",
  description:
    "Get to know Georgia Pro Solutions, a property-services company based in Allentown, Georgia, offering lawn care, pressure washing, and junk removal.",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <>
      <section className="page-hero about-hero">
        <div className="container">
          <Eyebrow>GEORGIA ROOTS. PROPERTY-FOCUSED.</Eyebrow>
          <h1>
            Local service.
            <br />
            Professional <span>standards.</span>
          </h1>
          <div className="about-hero-bottom">
            <p>
              A practical approach to property care,
              <br />
              from a company close to home.
            </p>
            <span>
              <MapPin size={17} /> ALLENTOWN, GEORGIA
            </span>
          </div>
        </div>
      </section>
      <div className="container about-photo-wrap">
        <Photo
          className="about-wide-photo"
          src="/images/home-porch.jpg"
          alt="Illustrative welcoming American porch and yard"
          priority
        />
        <span className="about-photo-caption">
          THERE’S NO PLACE LIKE A WELL-CARED-FOR HOME.
          <ArrowUpRight size={21} />
        </span>
      </div>
      <section className="section">
        <Reveal className="container about-story">
          <div>
            <Eyebrow>HELLO, WE’RE GEORGIA PRO SOLUTIONS.</Eyebrow>
            <h2>
              More than a to-do list.
              <br />
              It’s your property.
            </h2>
          </div>
          <div>
            <p className="large-copy">
              There’s a difference between having a space and enjoying it.
              That’s where a little care comes in.
            </p>
            <p>
              Based in Allentown, Georgia, Georgia Pro Solutions LLC brings lawn
              care, pressure washing, and junk removal together under one name.
            </p>
            <p>
              It’s a straightforward idea: make it easier to get help with the
              work around your property. Whether you’re keeping up with your
              lawn, refreshing the outside, or clearing a space, start with the
              things that matter to you.
            </p>
            <p>
              No two properties—or to-do lists—look exactly alike. So the
              conversation starts with yours.
            </p>
            <Button>Tell Us About Your Property</Button>
          </div>
        </Reveal>
      </section>
      <section className="about-philosophy">
        <div className="container philosophy-grid">
          <div>
            <Eyebrow light>A SIMPLE WAY TO LOOK AT IT</Eyebrow>
            <h2>
              Care for the property.
              <br />
              Consider the person.
            </h2>
            <p>
              Clear conversations, thoughtful details, and a scope of work that
              makes sense for your space.
            </p>
          </div>
          <ValueList />
        </div>
      </section>
      <section className="section">
        <div className="container about-local">
          <Photo
            src="/images/home-detail.jpg"
            alt="Illustrative cared-for home and outdoor details"
          />
          <div>
            <Eyebrow>CLOSE TO HOME</Eyebrow>
            <h2>
              Let’s make the most
              <br />
              of your corner
              <br />
              of Georgia.
            </h2>
            <p>
              Have a property in Allentown or nearby? Share your location and
              the work you have in mind. We’ll discuss availability for your
              address.
            </p>
            <Button href="/contact" variant="outline">
              Start a Conversation
            </Button>
          </div>
        </div>
      </section>
      <ClosingCTA />
    </>
  );
}
