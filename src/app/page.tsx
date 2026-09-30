import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  Stethoscope,
  Recycle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  MapPin,
  BadgeCheck,
} from "lucide-react";
import {
  getFeaturedProducts,
  getCategories,
  getProductsByCategory,
  getTestimonials,
  getFaqs,
  getProductBySlug,
} from "@/lib/data";
import { BRAND } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductCard";
import {
  Reveal,
  SectionHeading,
  ButtonLink,
  Eyebrow,
  Accordion,
  RatingStars,
  Badge,
} from "@/components/ui";

export const dynamic = "force-dynamic";

const TRUST_ITEMS = [
  { icon: Leaf, title: "Herbal Wellness", text: "Botanical formulations rooted in tradition." },
  { icon: Stethoscope, title: "Practitioner Guided", text: "Developed under practitioner guidance." },
  { icon: Recycle, title: "Eco-Friendly Products", text: "Sustainable bamboo hygiene essentials." },
  { icon: ShieldCheck, title: "Secure Online Shopping", text: "Safe checkout & careful packaging." },
];

export default async function HomePage() {
  const [featured, categories, ecoProducts, testimonials, faqs, cr500] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getProductsByCategory("eco-hygiene"),
    getTestimonials(),
    getFaqs(),
    getProductBySlug("cr-500-drops"),
  ]);

  return (
    <div className="-mt-16">
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-botanical-950">
        <Image
          src="/images/hero.jpg"
          alt="Herbal wellness products with fresh botanicals in warm natural light"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-botanical-950/85 via-botanical-950/55 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-36 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-300">HB Lifecare</p>
              <h1 className="font-display mt-5 text-4xl leading-[1.12] text-ivory sm:text-5xl lg:text-6xl">
                Natural Wellness.
                <br />
                Ancient Wisdom.
                <br />
                Modern Care.
              </h1>
              <p className="font-gurmukhi mt-5 text-lg text-gold-300 sm:text-xl">{BRAND.sloganPa}</p>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ivory/85">
                Discover thoughtfully developed herbal wellness products and holistic care rooted in
                natural therapies and traditional wellness practices.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <ButtonLink href="/products" size="lg" variant="gold">
                  Explore Products <ArrowRight size={16} />
                </ButtonLink>
                <ButtonLink
                  href="/services"
                  size="lg"
                  className="border border-ivory/40 bg-white/10 text-ivory backdrop-blur hover:bg-white/20"
                  variant="ghost"
                >
                  Book a Consultation
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
        {/* floating botanical accent */}
        <Leaf
          size={220}
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -right-10 rotate-12 text-ivory/5"
        />
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section aria-label="Why shop with HB Lifecare" className="border-b border-sand-deep/40 bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {TRUST_ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 80} className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-botanical-700/10 text-botanical-700">
                <item.icon size={19} />
              </span>
              <span>
                <span className="block text-sm font-bold text-charcoal">{item.title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted">{item.text}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Thoughtfully Crafted Wellness"
            title="Nature's Finest, Curated for Everyday Wellness"
            description="Explore our collection of herbal wellness, personal care and sustainable hygiene products."
          />
        </Reveal>
        <Reveal className="mt-12">
          <ProductGrid products={featured.slice(0, 8)} />
        </Reveal>
        <div className="mt-10 text-center">
          <ButtonLink href="/products" variant="secondary" size="lg">
            View All Products <ArrowRight size={15} />
          </ButtonLink>
        </div>
      </section>

      {/* ============ FLAGSHIP: CR 500 ============ */}
      {cr500 && (
        <section className="bg-botanical-900 text-ivory">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
            <Reveal className="relative">
              <div className="relative aspect-[4/5] max-w-md overflow-hidden rounded-3xl lg:mx-0">
                <Image
                  src={cr500.image}
                  alt="CR 500 Drops — flagship herbal formulation"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 left-6 flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-card-hover">
                <BadgeCheck size={16} /> 101% Money Back Guarantee*
              </div>
            </Reveal>
            <Reveal delay={120}>
              <Eyebrow className="!text-gold-300">Flagship Formulation</Eyebrow>
              <h2 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">CR 500 Drops</h2>
              <RatingStars
                rating={Number(cr500.rating)}
                reviewCount={cr500.reviewCount}
                className="mt-4 [&_span]:!text-ivory/80"
              />
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ivory/80">
                {cr500.shortDescription} Our flagship herbal formulation, developed under practitioner
                guidance for convenient daily use as part of a holistic wellness routine.
              </p>
              <ul className="mt-7 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
                {["Herbal formulation", "Practitioner-developed", "Convenient daily use", "101% Money Back Guarantee*"].map(
                  (b) => (
                    <li key={b} className="flex items-center gap-2.5 text-sm text-ivory/90">
                      <Sparkles size={14} className="shrink-0 text-gold-300" />
                      {b}
                    </li>
                  )
                )}
              </ul>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <ButtonLink href="/products/cr-500-drops" variant="gold" size="lg">
                  Explore CR 500 <ArrowRight size={16} />
                </ButtonLink>
                <span className="text-sm text-ivory/60">
                  *Guarantee terms as provided by the brand — see Refund Policy.
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============ CATEGORIES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Shop by Category"
            title="Three Paths to Everyday Wellness"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 100}>
              <Link
                href={`/products/${cat.slug}`}
                className="group relative block overflow-hidden rounded-3xl bg-charcoal shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-botanical-950/90 via-botanical-950/25 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="font-display text-2xl text-ivory">{cat.name}</h3>
                  <p className="mt-1.5 text-sm text-ivory/75">{cat.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-300 transition-transform duration-200 group-hover:translate-x-1">
                    Explore {cat.name} <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ PRACTITIONER ============ */}
      <section id="practitioner" className="bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal className="order-2 lg:order-1">
            <Eyebrow>Guided by Experience. Inspired by Nature.</Eyebrow>
            <h2 className="font-display mt-4 text-3xl leading-tight text-botanical-900 sm:text-4xl">
              {BRAND.practitioner}
            </h2>
            <p className="font-gurmukhi mt-2 text-lg text-gold-700">{BRAND.practitionerPa}</p>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-charcoal-soft">
              Dr. Sanjeev Jagdishma Vashisht leads the wellness practice behind HB Lifecare — guiding
              the Jagdishma Therapy Centre and Advance Acupressure Naturopathy Centre in Faridkot, and
              shaping the herbal formulations offered under the HB Lifecare and Herbivia Botanica names.
            </p>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-charcoal-soft">
              His approach brings together acupressure, naturopathy and traditional botanical wisdom in
              a holistic wellness framework centred on{" "}
              <span className="font-gurmukhi text-gold-700">{BRAND.sloganPa}</span> — health and divinity.
            </p>
            <ButtonLink href="/about#practitioner" className="mt-8" variant="secondary" size="lg">
              Meet Dr. Sanjeev <ArrowRight size={15} />
            </ButtonLink>
          </Reveal>
          <Reveal delay={120} className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-3xl shadow-card">
              <Image
                src="/images/practitioner.jpg"
                alt="Dr. Sanjeev Jagdishma Vashisht, lead practitioner at HB Lifecare"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ WELLNESS SERVICES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Holistic Care"
            title="Wellness Services, In-Clinic & Remote"
            description="Sessions offered within the centre's stated holistic wellness framework — complementary to, never a substitute for, professional medical care."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Advance Acupressure Therapy",
              text: "In-clinic wellness consultations at the Faridkot centre.",
              href: "/services/advance-acupressure-therapy",
              badge: "In-Clinic",
            },
            {
              title: "Distance Healing",
              text: "Remote wellness sessions offered by the centre.",
              href: "/services/distance-healing",
              badge: "Remote",
            },
            {
              title: "Chakra & Five Elements Alignment",
              text: "Remote sessions based on the centre's stated energy framework.",
              href: "/services/chakra-five-elements-alignment",
              badge: "Remote",
            },
          ].map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <Link
                href={s.href}
                className="group flex h-full flex-col rounded-3xl border border-sand-deep/60 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <Badge tone="sage">{s.badge}</Badge>
                <h3 className="font-display mt-4 text-xl text-botanical-900">{s.title}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-charcoal-soft">{s.text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-botanical-700 transition-transform duration-200 group-hover:translate-x-1">
                  Learn more <ArrowRight size={13} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/services" variant="secondary" size="lg">
            Explore Wellness Services
          </ButtonLink>
        </div>
      </section>

      {/* ============ ECO / HERBIVIA ============ */}
      <section className="bg-botanical-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Herbivia Botanica LLP</Eyebrow>
              <h2 className="font-display mt-4 text-3xl leading-tight text-botanical-900 sm:text-4xl">
                Better Choices for You &amp; the Planet
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-charcoal-soft">
                Better Choices. Naturally. Our eco-hygiene range swaps everyday plastics for
                biodegradable bamboo — soft bamboo-fibre sanitary pads, natural tongue cleaners and
                BPA-free-bristle bamboo brushes.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {["Bamboo", "Biodegradable", "Eco-conscious", "BPA-free soft bristles"].map((t) => (
                  <li key={t}>
                    <Badge tone="sage">{t}</Badge>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/products/eco-hygiene" className="mt-8" size="lg">
                Explore Herbivia Botanica <ArrowRight size={15} />
              </ButtonLink>
            </Reveal>
            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-3xl">
                  <Image
                    src="/images/bamboo.jpg"
                    alt="Herbivia Botanica bamboo hygiene essentials"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal className="mt-12">
            <ProductGrid products={ecoProducts.slice(0, 3)} columns={3} />
          </Reveal>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Customer Voices"
            title="Trusted Across the Wellness Journey"
            description="Sample entries shown below are placeholders awaiting real, business-approved customer testimonials."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <figure className="flex h-full flex-col rounded-3xl border border-sand-deep/60 bg-white p-7 shadow-card">
                <RatingStars rating={t.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-charcoal-soft">
                  “{t.review}”
                </blockquote>
                <figcaption className="mt-5 flex items-center justify-between border-t border-sand-deep/50 pt-4">
                  <span>
                    <span className="block text-sm font-bold text-charcoal">{t.customerName}</span>
                    <span className="block text-xs text-muted">{t.productOrService}</span>
                  </span>
                  {t.isPlaceholder ? (
                    <Badge tone="cream">Sample</Badge>
                  ) : t.verified ? (
                    <Badge tone="sage">Verified</Badge>
                  ) : null}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" />
        </Reveal>
        <Reveal className="mt-10">
          <Accordion items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
        </Reveal>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-botanical-900 px-6 py-16 text-center sm:px-16">
            <Leaf size={180} aria-hidden="true" className="absolute -left-10 -top-10 rotate-45 text-ivory/5" />
            <Leaf size={180} aria-hidden="true" className="absolute -bottom-12 -right-10 -rotate-12 text-ivory/5" />
            <p className="font-gurmukhi text-lg text-gold-300">{BRAND.sloganPa}</p>
            <h2 className="font-display mx-auto mt-4 max-w-xl text-3xl leading-tight text-ivory sm:text-4xl">
              Begin Your Wellness Journey
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ivory/75">
              Explore herbal wellness products or connect with our centre in Faridkot for guided care.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/products" variant="gold" size="lg">
                Explore Wellness
              </ButtonLink>
              <ButtonLink
                href="/contact"
                size="lg"
                variant="ghost"
                className="border border-ivory/40 text-ivory hover:bg-white/10"
              >
                <MapPin size={15} /> Visit the Centre
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
