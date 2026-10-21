import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/600.css";
import "./globals.css";
import { preview, siteUrl } from "@/lib/business";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Georgia Pro Solutions | One Call. More Solutions.",
    template: "%s | Georgia Pro Solutions",
  },
  description:
    "Lawn care, pressure washing, and junk removal. Discover Georgia Pro Solutions, a local property-services company based in Allentown, Georgia.",
  robots: {
    index: !preview && process.env.ALLOW_INDEXING === "true",
    follow: !preview && process.env.ALLOW_INDEXING === "true",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Georgia Pro Solutions",
    title: "One Call. More Solutions.",
    description: "A fresh perspective on property care in Allentown, Georgia.",
    images: [
      {
        url: "/images/home-hero.jpg",
        width: 1600,
        height: 1000,
        alt: "Illustrative well-kept home and lawn",
      },
    ],
  },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
