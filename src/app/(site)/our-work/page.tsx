import type { Metadata } from "next";
import { Eyebrow, ClosingCTA, Button } from "@/components/ui";
import { Gallery } from "@/components/gallery";
export const metadata: Metadata = {
  title: "Our Work & Inspiration",
  description:
    "Explore a visual guide to lawn care, exterior cleaning, and clearer spaces. Illustrative property-care photography for the Georgia Pro Solutions concept.",
  alternates: { canonical: "/our-work" },
};
export default function Work() {
  return (
    <>
      <section className="page-hero work-hero">
        <div className="container">
          <Eyebrow>THE POSSIBILITIES OUTSIDE YOUR DOOR</Eyebrow>
          <div className="page-hero-split">
            <h1>
              Good care.
              <br />
              <span>Great possibilities.</span>
            </h1>
            <div>
              <p>
                A greener welcome. A cleaner first impression. Room for
                something new. Explore a little property-care inspiration.
              </p>
              <span className="pill">
                <span /> INSPIRATION GALLERY
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="work-gallery-section">
        <div className="container">
          <div className="gallery-disclosure">
            <span>AN ILLUSTRATIVE LOOK AT PROPERTY CARE</span>
            <p>
              These licensed stock photographs illustrate service categories.
              They are not completed Georgia Pro Solutions projects.
            </p>
          </div>
          <Gallery filters />
          <div className="gallery-ending">
            <span>YOUR PROPERTY COULD BE NEXT.</span>
            <h2>Have a project in mind?</h2>
            <Button>Let’s Talk About It</Button>
          </div>
        </div>
      </section>
      <ClosingCTA />
    </>
  );
}
