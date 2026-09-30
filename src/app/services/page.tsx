import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { getServices } from "@/lib/data";
import { Breadcrumbs, Eyebrow, Badge, Reveal, ButtonLink } from "@/components/ui";
import { BRAND } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wellness Services — Acupressure, Naturopathy & Remote Sessions",
  description:
    "In-clinic acupressure and naturopathy at Faridkot, plus remote wellness sessions — offered within the centre's stated holistic framework.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wellness Services" }]} />

      <div className="mt-6 grid items-center gap-8 overflow-hidden rounded-3xl bg-botanical-900 lg:grid-cols-2">
        <div className="p-8 sm:p-12">
          <Eyebrow className="!text-gold-300">Jagdishma Therapy Centre</Eyebrow>
          <h1 className="font-display mt-3 text-4xl leading-tight text-ivory sm:text-5xl">
            Holistic Care, In-Clinic &amp; Remote
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ivory/80">
            Acupressure, naturopathy and remote wellness sessions guided by {BRAND.practitioner} —
            offered within the centre&apos;s stated holistic wellness framework, complementary to
            professional medical care.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-ivory/70">
            <MapPin size={15} className="text-gold-300" /> {BRAND.address}
          </p>
        </div>
        <div className="relative hidden aspect-[4/3] lg:block">
          <Image src="/images/therapy.jpg" alt="Calm natural therapy room at the Faridkot centre" fill sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-botanical-900 to-transparent" />
        </div>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.id} delay={i * 80}>
            <Link
              href={`/services/${s.slug}`}
              className="group flex h-full flex-col rounded-3xl border border-sand-deep/60 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex items-center gap-2">
                <Badge tone={s.serviceType === "VIRTUAL" ? "gold" : "sage"}>
                  {s.serviceType === "VIRTUAL" ? "Remote" : "In-Clinic"}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted">
                  <Clock size={12} /> {s.duration} min
                </span>
              </div>
              <h2 className="font-display mt-4 text-xl text-botanical-900">{s.title}</h2>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-charcoal-soft">{s.shortDescription}</p>
              <p className="mt-4 text-xs font-semibold text-muted">
                {s.price > 0 ? `From ₹${s.price}` : "Pricing confirmed at booking"}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-botanical-700 transition-transform duration-200 group-hover:translate-x-1">
                Request a session <ArrowRight size={13} />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border border-gold-500/25 bg-gold-500/5 p-6">
        <p className="text-xs leading-relaxed text-charcoal-soft">
          Remote and subtle-energy sessions reflect the organisation&apos;s stated wellness framework.
          They are not presented as established medical or scientific treatments, and are not a
          substitute for professional medical care. {BRAND.disclaimer}
        </p>
      </div>

      <div className="mt-10 text-center">
        <ButtonLink href="/contact" variant="secondary" size="lg">
          Questions? Contact the Centre
        </ButtonLink>
      </div>
    </div>
  );
}
