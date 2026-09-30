"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
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
        body: JSON.stringify({ type: "contact", ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send message.");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message.");
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-botanical-200 bg-botanical-50 p-8 text-center">
        <CheckCircle2 size={36} className="mx-auto text-success" />
        <h3 className="font-display mt-4 text-xl text-botanical-900">Message received</h3>
        <p className="mt-2 text-sm text-charcoal-soft">Thank you, {form.name}. Our team will get back to you soon.</p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-sand-deep bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-botanical-500";
  const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal-soft";

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card sm:p-8">
      <h2 className="font-display text-2xl text-botanical-900">Send us a message</h2>
      {error && (
        <p role="alert" className="rounded-xl border border-danger/25 bg-danger/5 px-4 py-2.5 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-name" className={labelCls}>Name</label>
          <input id="ct-name" required className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label htmlFor="ct-phone" className={labelCls}>Phone (optional)</label>
          <input id="ct-phone" type="tel" className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
      </div>
      <div>
        <label htmlFor="ct-email" className={labelCls}>Email (optional)</label>
        <input id="ct-email" type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} />
      </div>
      <div>
        <label htmlFor="ct-subject" className={labelCls}>Subject</label>
        <input id="ct-subject" className={inputCls} value={form.subject} onChange={(e) => set("subject", e.target.value)} />
      </div>
      <div>
        <label htmlFor="ct-message" className={labelCls}>Message</label>
        <textarea id="ct-message" required rows={5} className={inputCls} value={form.message} onChange={(e) => set("message", e.target.value)} />
      </div>
      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
