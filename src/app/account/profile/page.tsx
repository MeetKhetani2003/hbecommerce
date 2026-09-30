import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = (await getCurrentUser())!;

  const rows = [
    { label: "Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone || "—" },
  ];

  return (
    <div className="rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card sm:p-8">
      <h2 className="font-display text-xl text-botanical-900">Profile</h2>
      <dl className="mt-5 divide-y divide-sand-deep/50">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between py-3.5">
            <dt className="text-xs font-bold uppercase tracking-wider text-muted">{r.label}</dt>
            <dd className="text-sm font-semibold text-charcoal">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 rounded-xl bg-cream px-4 py-3 text-xs text-charcoal-soft">
        To update your details, contact us via WhatsApp or the contact form — self-serve profile
        editing is coming soon.
      </p>
    </div>
  );
}
