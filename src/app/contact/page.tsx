import type { Metadata } from "next";
import { Phone, Building2, MapPin, Clock, Mail, MessageCircle } from "lucide-react";
import { Breadcrumbs, Eyebrow } from "@/components/ui";
import { ContactForm } from "@/components/contact/ContactForm";
import { BRAND } from "@/lib/types";

export const metadata: Metadata = {
  title: "Contact — We're Here to Help",
  description:
    "Reach HB Lifecare by phone, WhatsApp or the contact form. Visit us at Shop No. 46A, New Dana Mandi, Faridkot, Punjab.",
  alternates: { canonical: "/contact" },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "HB Lifecare — Jagdishma Therapy Centre",
  telephone: "+91-75278-06146",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shop No. 46A, New Dana Mandi",
    addressLocality: "Faridkot",
    addressRegion: "Punjab",
    addressCountry: "IN",
  },
};

export default function ContactPage() {
  const cards: { icon: typeof Phone; title: string; lines: { text: string; href?: string }[] }[] = [
    {
      icon: Phone,
      title: "HB Lifecare",
      lines: BRAND.phones.map((p) => ({ text: p, href: `tel:+91${p.replace(/-/g, "")}` })),
    },
    {
      icon: Building2,
      title: "Head Office",
      lines: [{ text: BRAND.headOffice, href: `tel:+91${BRAND.headOffice.replace(/-/g, "")}` }],
    },
    {
      icon: MapPin,
      title: "Physical Centre",
      lines: [{ text: "Shop No. 46A, New Dana Mandi, Faridkot, Punjab, India" }],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div className="mt-6 max-w-2xl">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="font-display mt-3 text-4xl text-botanical-900 sm:text-5xl">We&apos;re Here to Help</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-charcoal-soft">
          Questions about products, orders or wellness sessions — reach us any way you prefer.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="rounded-3xl border border-sand-deep/60 bg-white p-7 shadow-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-botanical-50 text-botanical-700">
              <c.icon size={19} />
            </span>
            <h2 className="font-display mt-4 text-xl text-botanical-900">{c.title}</h2>
            <div className="mt-2 space-y-1">
              {c.lines.map((l) =>
                l.href ? (
                  <a key={l.text} href={l.href} className="block text-sm font-semibold text-charcoal-soft hover:text-botanical-800">
                    {l.text}
                  </a>
                ) : (
                  <p key={l.text} className="text-sm leading-relaxed text-charcoal-soft">{l.text}</p>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <ContactForm />
        <div className="space-y-5">
          <a
            href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hello HB Lifecare, I have a question.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#1da851]">
              <MessageCircle size={22} />
            </span>
            <span>
              <span className="block text-sm font-bold text-charcoal">Chat with HB Lifecare</span>
              <span className="block text-xs text-muted">Fastest replies on WhatsApp</span>
            </span>
          </a>

          <div className="rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
              <Clock size={14} className="text-gold-700" /> Business hours
            </p>
            <p className="mt-2 text-sm text-charcoal-soft">[CMS: business hours to be confirmed by the business]</p>
            <p className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
              <Mail size={14} className="text-gold-700" /> Email
            </p>
            <p className="mt-2 text-sm text-charcoal-soft">[CMS: business email to be confirmed]</p>
          </div>

          {/* Map placeholder */}
          <div className="flex aspect-[16/9] items-center justify-center rounded-3xl border border-dashed border-sand-deep bg-cream text-center">
            <div>
              <MapPin size={26} className="mx-auto text-botanical-500" />
              <p className="mt-2 text-sm font-semibold text-charcoal-soft">Google Maps embed placeholder</p>
              <p className="text-xs text-muted">New Dana Mandi, Faridkot, Punjab</p>
            </div>
          </div>
          <p className="text-xs text-muted">GSTIN: {BRAND.gstin}</p>
        </div>
      </div>
    </div>
  );
}
