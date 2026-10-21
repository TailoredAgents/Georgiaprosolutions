import { Header, Footer } from "@/components/navigation";
import { Analytics } from "@/components/analytics";
import { Suspense } from "react";
import { BusinessSchema } from "@/components/business-schema";
import { preview } from "@/lib/business";
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer isPreview={preview} />
      <BusinessSchema />
      <Suspense>
        <Analytics />
      </Suspense>
    </>
  );
}
