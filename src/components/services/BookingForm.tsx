"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";
import type { Service } from "@/lib/types";

const TIME_SLOTS = ["Morning (9am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–7pm)"];

export function BookingForm({ service }: { service: Service }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: TIME_SLOTS[0],
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceSlug: service.slug, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit request.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit request.");
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-botanical-200 bg-botanical-50 p-8 text-center">
        <CheckCircle2 size={36} className="mx-auto text-success" />
        <h3 className="font-display mt-4 text-xl text-botanical-900">Request received</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
          Your session request for <strong>{service.title}</strong> is now pending practitioner
          review. Our team will confirm timing and details on <strong>{form.phone}</strong>.
        </p>
        <p className="mt-3 text-xs text-muted">Status: PENDING_PRACTITIONER_REVIEW</p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-sand-deep bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-botanical-500";
  const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal-soft";

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card sm:p-8">
      <h3 className="font-display text-xl text-botanical-900">Request this Session</h3>
      <p className="text-xs leading-relaxed text-muted">
        Every request is reviewed by the practitioner before confirmation — timing and pricing are
        confirmed directly with you.
      </p>
      {error && (
        <p role="alert" className="rounded-xl border border-danger/25 bg-danger/5 px-4 py-2.5 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bk-name" className={labelCls}>Name</label>
          <input id="bk-name" required className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label htmlFor="bk-phone" className={labelCls}>Mobile</label>
          <input id="bk-phone" required type="tel" className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
      </div>
      <div>
        <label htmlFor="bk-email" className={labelCls}>Email (optional)</label>
        <input id="bk-email" type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bk-date" className={labelCls}>Preferred date</label>
          <input id="bk-date" required type="date" min={minDate} className={inputCls} value={form.preferredDate} onChange={(e) => set("preferredDate", e.target.value)} />
        </div>
        <div>
          <label htmlFor="bk-time" className={labelCls}>Preferred time</label>
          <select id="bk-time" className={inputCls} value={form.preferredTime} onChange={(e) => set("preferredTime", e.target.value)}>
            {TIME_SLOTS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="bk-notes" className={labelCls}>Anything we should know? (optional)</label>
        <textarea id="bk-notes" rows={3} className={inputCls} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Submitting…" : "Request Session"}
      </Button>
    </form>
  );
}
