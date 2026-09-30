import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Leaf, Sparkles, HeartHandshake } from "lucide-react";
import { Breadcrumbs, Eyebrow, Reveal, ButtonLink, SectionHeading } from "@/components/ui";
import { BRAND } from "@/lib/types";

export const metadata: Metadata = {
  title: "About — Our Story, Practitioner & Brand Ecosystem",
  description:
    "The story of HB Lifecare, Herbivia Botanica LLP and Jagdishma Therapy Centre — natural wellness rooted in Faridkot, Punjab.",
  alternates: { canonical: "/about" },
};

const TIMELINE = [
  {
    title: "Jagdishma Therapy Centre",
    text: "The practice begins with hands-on holistic care — the Jagdishma Therapy Centre and Advance Acupressure Naturopathy Centre in Faridkot, where acupressure and naturopathy sessions are offered under the guidance of Dr. Sanjeev Jagdishma Vashisht.",
    icon: HeartHandshake,
  },
  {
    title: "HB Lifecare",
    text: "From the clinic's wellness philosophy grew HB Lifecare — a range of herbal formulations for internal wellness and topical care, developed to bring the centre's approach into everyday routines.",
    icon: Leaf,
  },
  {
    title: "Herbivia Botanica LLP",
    text: "Herbivia Botanica LLP extends the same values to sustainable living — bamboo-based, biodegradable hygiene essentials that are better choices for you and the planet.",
    icon: Sparkles,
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      {/* Hero */}
      <div className="mt-6 overflow-hidden rounded-3xl bg-botanical-900">
        <div className="grid items-center lg:grid-cols-2">
          <div className="p-8 sm:p-14">
            <Eyebrow className="!text-gold-300">Our Story</Eyebrow>
            <h1 className="font-display mt-4 text-4xl leading-tight text-ivory sm:text-5xl">
              One Philosophy.
              <br />
              Three Ways to Care.
            </h1>
            <p className="font-gurmukhi mt-4 text-lg text-gold-300">{BRAND.sloganPa}</p>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ivory/80">
              HB Lifecare, Herbivia Botanica LLP and the Jagdishma Therapy Centre share one belief:
              wellness grows best when nature, tradition and attentive care work together.
            </p>
          </div>
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full">
            <Image src="/images/hero.jpg" alt="Herbal botanicals and formulations" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </div>

      {/* Timeline / ecosystem */}
      <section className="mx-auto mt-20 max-w-3xl">
        <Reveal>
          <SectionHeading eyebrow="Brand Ecosystem" title="How the Ecosystem Grew" />
        </Reveal>
        <ol className="relative mt-12 space-y-10 border-l-2 border-botanical-200 pl-8">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.title} as="li" delay={i * 100} className="relative">
              <span className="absolute -left-[45px] flex h-9 w-9 items-center justify-center rounded-full bg-botanical-700 text-ivory">
                <t.icon size={16} />
              </span>
              <h3 className="font-display text-xl text-botanical-900">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{t.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Practitioner */}
      <section id="practitioner" className="mt-20 grid items-center gap-12 rounded-3xl bg-cream p-8 sm:p-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-3xl shadow-card">
            <Image src="/images/practitioner.jpg" alt={BRAND.practitioner} fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <Eyebrow>Lead Practitioner</Eyebrow>
          <h2 className="font-display mt-3 text-3xl text-botanical-900 sm:text-4xl">{BRAND.practitioner}</h2>
          <p className="font-gurmukhi mt-2 text-lg text-gold-700">{BRAND.practitionerPa}</p>
          <p className="mt-6 text-[15px] leading-relaxed text-charcoal-soft">
            Dr. Sanjeev Jagdishma Vashisht guides the wellness practice behind the HB Lifecare
            ecosystem — leading in-clinic acupressure and naturopathy care in Faridkot, offering the
            centre&apos;s remote wellness sessions, and shaping the herbal formulations sold under the
            HB Lifecare name.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-charcoal-soft">
            His work is centred on the brand&apos;s guiding idea —{" "}
            <span className="font-gurmukhi text-gold-700">{BRAND.sloganPa}</span> (&ldquo;Health and
            Divinity&rdquo;) — caring for the whole person through natural therapies, traditional
            botanical wisdom and mindful daily routines.
          </p>
          <ButtonLink href="/services" className="mt-8" variant="secondary" size="lg">
            Explore Wellness Services
          </ButtonLink>
        </Reveal>
      </section>

      {/* Philosophy + product development */}
      <section className="mt-20 grid gap-6 md:grid-cols-2">
        <Reveal className="rounded-3xl border border-sand-deep/60 bg-white p-8 shadow-card">
          <Eyebrow>Wellness Philosophy</Eyebrow>
          <h3 className="font-display mt-3 text-2xl text-botanical-900">Whole-Person, Nature-First</h3>
          <p className="mt-4 text-sm leading-relaxed text-charcoal-soft">
            We see wellness as a daily practice — supported by botanicals, balanced routines and
            attentive practitioner guidance. Our holistic framework (including acupressure,
            naturopathy and the centre&apos;s subtle-energy practices) is offered as complementary
            care, never as a replacement for professional medical treatment.
          </p>
        </Reveal>
        <Reveal delay={100} className="rounded-3xl border border-sand-deep/60 bg-white p-8 shadow-card">
          <Eyebrow>Product Development</Eyebrow>
          <h3 className="font-display mt-3 text-2xl text-botanical-900">Practitioner-Guided Formulation</h3>
          <p className="mt-4 text-sm leading-relaxed text-charcoal-soft">
            Every HB Lifecare formulation begins with the centre&apos;s clinical experience and
            traditional botanical knowledge. Full composition and directions are provided on each
            pack, and our team shares complete ingredient sheets on request.
          </p>
        </Reveal>
      </section>

      {/* Location + CTA */}
      <section className="mt-20 rounded-3xl bg-botanical-900 p-8 text-center sm:p-14">
        <MapPin size={26} className="mx-auto text-gold-300" />
        <h2 className="font-display mt-4 text-3xl text-ivory">Visit the Centre</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory/80">
          Shop No. 46A, New Dana Mandi, Faridkot, Punjab, India
        </p>
        <p className="mt-2 text-sm text-ivory/60">
          {BRAND.phones.join(" · ")} · H.O. {BRAND.headOffice}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/contact" variant="gold" size="lg">
            Contact Us
          </ButtonLink>
          <ButtonLink href="/products" variant="ghost" size="lg" className="border border-ivory/40 text-ivory hover:bg-white/10">
            Shop the Collection
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
