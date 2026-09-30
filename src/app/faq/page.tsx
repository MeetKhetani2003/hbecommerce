import type { Metadata } from "next";
import { getFaqs } from "@/lib/data";
import { Breadcrumbs, Eyebrow, Accordion, ButtonLink } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about ordering, contact, payments, tracking and policies at HB Lifecare.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      <div className="mt-6">
        <Eyebrow>Good to Know</Eyebrow>
        <h1 className="font-display mt-3 text-4xl text-botanical-900">Frequently Asked Questions</h1>
      </div>
      <div className="mt-10">
        <Accordion items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
      </div>
      <div className="mt-10 text-center">
        <ButtonLink href="/contact" variant="secondary">
          Still have a question? Contact us
        </ButtonLink>
      </div>
    </div>
  );
}
