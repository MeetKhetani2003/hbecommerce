import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, MapPin, UserRound } from "lucide-react";
import { getServiceBySlug, getServices } from "@/lib/data";
import { Breadcrumbs, Badge, Eyebrow } from "@/components/ui";
import { BookingForm } from "@/components/services/BookingForm";
import { BRAND } from "@/lib/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: `${service.title} — Wellness Service`,
    description: service.shortDescription,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();
  const others = (await getServices()).filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Wellness Services", href: "/services" },
          { label: service.title },
        ]}
      />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_420px]">
        <div>
          <div className="flex items-center gap-2.5">
            <Badge tone={service.serviceType === "VIRTUAL" ? "gold" : "sage"}>
              {service.serviceType === "VIRTUAL" ? "Remote Session" : "In-Clinic"}
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Clock size={13} /> {service.duration} minutes
            </span>
          </div>
          <h1 className="font-display mt-4 text-4xl text-botanical-900 sm:text-5xl">{service.title}</h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-charcoal-soft">{service.description}</p>

          <dl className="mt-8 grid max-w-lg gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-sand-deep/60 bg-white p-5">
              <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
                <UserRound size={14} className="text-gold-700" /> Practitioner
              </dt>
              <dd className="mt-2 text-sm font-bold text-charcoal">{service.practitioner}</dd>
              <dd className="font-gurmukhi mt-0.5 text-xs text-gold-700">{BRAND.practitionerPa}</dd>
            </div>
            <div className="rounded-2xl border border-sand-deep/60 bg-white p-5">
              <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
                <MapPin size={14} className="text-gold-700" /> Location
              </dt>
              <dd className="mt-2 text-sm font-semibold leading-relaxed text-charcoal-soft">
                {service.serviceType === "VIRTUAL" ? "Remote — joining details shared after confirmation" : BRAND.address}
              </dd>
            </div>
          </dl>

          <div className="relative mt-10 hidden aspect-[16/7] overflow-hidden rounded-3xl lg:block">
            <Image src="/images/therapy.jpg" alt="Natural therapy space" fill sizes="60vw" className="object-cover" />
          </div>

          <p className="mt-8 max-w-2xl rounded-2xl border border-gold-500/25 bg-gold-500/5 p-5 text-xs leading-relaxed text-charcoal-soft">
            These sessions reflect the organisation&apos;s stated wellness framework and are offered as
            complementary wellness care — not as a substitute for professional medical diagnosis or
            treatment. Product recommendations arising from consultations always require practitioner
            review before checkout.
          </p>

          {others.length > 0 && (
            <div className="mt-10">
              <Eyebrow>Other Sessions</Eyebrow>
              <ul className="mt-4 space-y-2">
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="text-sm font-semibold text-botanical-700 underline underline-offset-4 hover:text-botanical-900">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <BookingForm service={service} />
        </aside>
      </div>
    </div>
  );
}
