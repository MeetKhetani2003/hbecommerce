import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Playfair_Display, Noto_Sans_Gurmukhi } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ToastViewport } from "@/components/ui";
import { BRAND } from "@/lib/types";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const gurmukhi = Noto_Sans_Gurmukhi({
  subsets: ["gurmukhi"],
  weight: ["400", "600"],
  variable: "--font-gurmukhi",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HB Lifecare — Natural Wellness, Herbal Products & Holistic Care",
    template: "%s | HB Lifecare",
  },
  description:
    "Premium herbal wellness products, eco-friendly bamboo hygiene essentials and holistic wellness services from HB Lifecare, Herbivia Botanica LLP and Jagdishma Therapy Centre, Faridkot, Punjab.",
  openGraph: {
    siteName: "HB Lifecare",
    type: "website",
    locale: "en_IN",
    images: ["/images/hero.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HB Lifecare",
  slogan: BRAND.sloganPa,
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop No. 46A, New Dana Mandi",
    addressLocality: "Faridkot",
    addressRegion: "Punjab",
    addressCountry: "IN",
  },
  telephone: "+91-75278-06146",
  subOrganization: [
    { "@type": "Organization", name: "Herbivia Botanica LLP" },
    { "@type": "LocalBusiness", name: "Jagdishma Therapy Centre" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${playfair.variable} ${gurmukhi.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <StoreProvider>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
          <ToastViewport />
        </StoreProvider>
      </body>
    </html>
  );
}
