import { Breadcrumbs, Eyebrow } from "@/components/ui";
import { BRAND } from "@/lib/types";

/**
 * Shared legal page shell. Policy bodies are CMS-editable placeholders —
 * final wording must be provided/approved by the business & legal team.
 */
export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <Eyebrow className="mt-6">Legal</Eyebrow>
      <h1 className="font-display mt-3 text-4xl text-botanical-900">{title}</h1>
      <p className="mt-4 text-sm leading-relaxed text-charcoal-soft">{intro}</p>

      <div className="mt-8 rounded-2xl border border-gold-500/25 bg-gold-500/5 p-5 text-xs leading-relaxed text-charcoal-soft">
        <strong>Editable placeholder:</strong> the sections below are structural placeholders. Final,
        business-approved wording should be published here by the HB Lifecare team before launch.
      </div>

      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-xl text-botanical-900">{s.heading}</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-charcoal-soft">{s.body}</p>
          </section>
        ))}
      </div>

      <p className="mt-12 border-t border-sand-deep/60 pt-6 text-xs text-muted">
        HB Lifecare · {BRAND.address} · GSTIN: {BRAND.gstin}
      </p>
    </div>
  );
}
