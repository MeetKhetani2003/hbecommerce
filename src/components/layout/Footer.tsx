import Link from "next/link";
import { Leaf, MapPin, Phone } from "lucide-react";
import { BRAND } from "@/lib/types";

const SHOP_LINKS = [
  { label: "Internal Supplements", href: "/products/internal-supplements" },
  { label: "Topical Care", href: "/products/topical-care" },
  { label: "Eco Hygiene", href: "/products/eco-hygiene" },
  { label: "New Arrivals", href: "/products" },
  { label: "Best Sellers", href: "/products" },
];

const SERVICE_LINKS = [
  { label: "Acupressure Therapy", href: "/services/advance-acupressure-therapy" },
  { label: "Naturopathy", href: "/services/naturopathy" },
  { label: "Distance Healing", href: "/services/distance-healing" },
  { label: "Chakra Alignment", href: "/services/chakra-five-elements-alignment" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Practitioner", href: "/about#practitioner" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-botanical-950 text-ivory/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-botanical-700 text-ivory">
                <Leaf size={17} />
              </span>
              <span className="font-display text-xl text-ivory">HB Lifecare</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">Natural wellness and herbal products.</p>
            <p className="font-gurmukhi mt-3 text-sm text-gold-300">{BRAND.sloganPa}</p>
            <p className="mt-1 text-xs text-ivory/50">{BRAND.sloganEn}</p>
            <p className="mt-4 text-xs text-ivory/50">
              Herbivia Botanica LLP · Jagdishma Therapy Centre · Advance Acupressure Naturopathy Centre
            </p>
          </div>

          {/* Shop */}
          <nav aria-label="Shop links">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Shop</h3>
            <ul className="mt-4 space-y-2.5">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Service links">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Services</h3>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company links">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Company</h3>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm transition-colors hover:text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Contact</h3>
            <address className="mt-4 space-y-3 text-sm not-italic">
              <p className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold-300" />
                Shop No. 46A, New Dana Mandi,
                <br />
                Faridkot, Punjab, India
              </p>
              <p className="flex items-start gap-2">
                <Phone size={15} className="mt-0.5 shrink-0 text-gold-300" />
                <span>
                  {BRAND.phones.map((p) => (
                    <a key={p} href={`tel:+91${p.replace(/-/g, "")}`} className="block hover:text-ivory">
                      {p}
                    </a>
                  ))}
                  <span className="mt-1 block text-xs text-ivory/50">H.O. {BRAND.headOffice}</span>
                </span>
              </p>
              <p className="text-xs text-ivory/50">GSTIN: {BRAND.gstin}</p>
            </address>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-14 rounded-2xl border border-ivory/10 bg-ivory/5 p-5">
          <p className="text-[11px] leading-relaxed text-ivory/50">
            <strong className="text-ivory/70">Wellness disclaimer:</strong> {BRAND.disclaimer}
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-ivory/10 pt-6 sm:flex-row">
          <p className="text-xs text-ivory/50">© {new Date().getFullYear()} HB Lifecare. All Rights Reserved.</p>
          <p className="font-gurmukhi text-xs text-gold-300">{BRAND.sloganPa}</p>
        </div>
      </div>
    </footer>
  );
}
