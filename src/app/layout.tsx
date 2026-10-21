import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { preview, siteUrl } from "@/lib/business";
const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
  adjustFontFallback: "Arial",
});
const sora = localFont({
  src: "../../node_modules/@fontsource-variable/sora/files/sora-latin-wght-normal.woff2",
  variable: "--font-sora",
  weight: "100 800",
  display: "swap",
  adjustFontFallback: "Arial",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Georgia Pro Solutions | Property Services in Allentown, GA",
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
    title: "Georgia Pro Solutions | One Call. More Solutions.",
    description: "A fresh perspective on property care in Allentown, Georgia.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Georgia Pro Solutions: lawn care, pressure washing, and junk removal in Allentown, Georgia",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${sora.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
