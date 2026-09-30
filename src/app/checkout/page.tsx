"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, ShieldCheck, ChevronLeft, Banknote, CreditCard, Smartphone } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { formatINR, computeTotals } from "@/lib/format";
import { Button, EmptyState, ButtonLink } from "@/components/ui";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const INDIAN_STATES = [
  "Punjab", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, hydrated, clearCart, pushToast } = useStore();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "Punjab",
    pincode: "",
    terms: false,
  });

  const totals = computeTotals(cart, form.state);
  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  if (hydrated && cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          icon={<ShoppingBag size={30} />}
          title="Nothing to check out yet."
          message="Your cart is empty — explore the collection first."
          cta={{ label: "Explore Products", href: "/products" }}
        />
      </div>
    );
  }

  const validateStep = (): string | null => {
    if (step === 1) {
      if (form.name.trim().length < 2) return "Please enter your full name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email.";
      if (form.phone.replace(/\D/g, "").length < 10) return "Please enter a valid 10-digit phone number.";
    }
    if (step === 2) {
      if (!form.line1.trim()) return "Please enter your address.";
      if (!form.city.trim()) return "Please enter your city.";
      if (!/^\d{6}$/.test(form.pincode)) return "PIN code must be 6 digits.";
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep((s) => Math.min(3, s + 1) as Step);
  };

  const placeOrder = async () => {
    if (!form.terms) {
      setError("Please accept the Terms & Refund Policy to continue.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((l) => ({ productId: l.productId, quantity: l.quantity })),
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          paymentMethod: "COD",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place order.");
      clearCart();
      pushToast({ title: "Order placed", message: `Order ${data.orderNumber}`, tone: "success" });
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-sand-deep bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-botanical-500 placeholder:text-muted";
  const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal-soft";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-botanical-900">Checkout</h1>
        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-success">
          <Lock size={13} /> Secure checkout
        </p>
      </div>

      {/* Stepper */}
      <ol className="mt-6 flex items-center gap-2 text-xs font-bold" aria-label="Checkout steps">
        {["Contact", "Delivery Address", "Review & Payment"].map((label, i) => {
          const n = (i + 1) as Step;
          const done = step > n;
          const current = step === n;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] ${
                  done || current ? "bg-botanical-700 text-ivory" : "bg-sand text-muted"
                }`}
              >
                {done ? "✓" : n}
              </span>
              <span className={current ? "text-botanical-800" : "text-muted"}>{label}</span>
              {i < 2 && <span className="mx-1 h-px w-6 bg-sand-deep sm:w-12" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          {error && (
            <p role="alert" className="mb-5 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3 text-sm font-semibold text-danger">
              {error}
            </p>
          )}

          {step === 1 && (
            <fieldset className="space-y-5 rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card sm:p-8">
              <legend className="sr-only">Contact details</legend>
              <div>
                <label htmlFor="name" className={labelCls}>Full name</label>
                <input id="name" className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className={labelCls}>Email</label>
                  <input id="email" type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                </div>
                <div>
                  <label htmlFor="phone" className={labelCls}>Mobile number</label>
                  <input id="phone" type="tel" className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="10-digit mobile" />
                </div>
              </div>
              <Button size="lg" onClick={next}>Continue to Delivery</Button>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="space-y-5 rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card sm:p-8">
              <legend className="sr-only">Delivery address</legend>
              <div>
                <label htmlFor="line1" className={labelCls}>Address line 1</label>
                <input id="line1" className={inputCls} value={form.line1} onChange={(e) => set("line1", e.target.value)} autoComplete="address-line1" />
              </div>
              <div>
                <label htmlFor="line2" className={labelCls}>Address line 2 (optional)</label>
                <input id="line2" className={inputCls} value={form.line2} onChange={(e) => set("line2", e.target.value)} autoComplete="address-line2" />
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="city" className={labelCls}>City</label>
                  <input id="city" className={inputCls} value={form.city} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" />
                </div>
                <div>
                  <label htmlFor="state" className={labelCls}>State</label>
                  <select id="state" className={inputCls} value={form.state} onChange={(e) => set("state", e.target.value)}>
                    {INDIAN_STATES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="pincode" className={labelCls}>PIN code</label>
                  <input id="pincode" inputMode="numeric" className={inputCls} value={form.pincode} onChange={(e) => set("pincode", e.target.value)} autoComplete="postal-code" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  <ChevronLeft size={15} /> Back
                </Button>
                <Button size="lg" onClick={next}>Review Order</Button>
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <section className="rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card sm:p-8">
                <h2 className="font-display text-xl text-botanical-900">Order Review</h2>
                <dl className="mt-4 grid gap-1 text-sm text-charcoal-soft">
                  <div><dt className="inline font-bold text-charcoal">Deliver to: </dt><dd className="inline">{form.name}, {form.phone}</dd></div>
                  <div><dd>{form.line1}{form.line2 ? `, ${form.line2}` : ""}, {form.city}, {form.state} — {form.pincode}</dd></div>
                </dl>
                <button type="button" onClick={() => setStep(2)} className="mt-3 text-xs font-bold text-botanical-700 underline underline-offset-4">
                  Edit address
                </button>
              </section>

              <section className="rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card sm:p-8">
                <h2 className="font-display text-xl text-botanical-900">Payment</h2>
                <div className="mt-4 space-y-3" role="radiogroup" aria-label="Payment method">
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-botanical-700 bg-botanical-50/60 p-4">
                    <input type="radio" name="payment" defaultChecked className="accent-botanical-700" />
                    <Banknote size={18} className="text-botanical-700" />
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-charcoal">Cash on Delivery</span>
                      <span className="block text-xs text-muted">Pay when your order arrives.</span>
                    </span>
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-sand-deep p-4 opacity-60">
                    <Smartphone size={18} className="text-muted" />
                    <CreditCard size={18} className="text-muted" />
                    <span className="text-xs text-muted">
                      UPI, Cards &amp; Net Banking will appear here once the payment gateway (e.g. Razorpay)
                      is configured by the business.
                    </span>
                  </div>
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-charcoal-soft">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => set("terms", e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-botanical-700"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="font-bold text-botanical-700 underline underline-offset-2">Terms</Link>{" "}
                    and{" "}
                    <Link href="/refund-policy" className="font-bold text-botanical-700 underline underline-offset-2">Refund Policy</Link>.
                  </span>
                </label>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => setStep(2)}>
                    <ChevronLeft size={15} /> Back
                  </Button>
                  <Button size="lg" variant="gold" onClick={placeOrder} disabled={submitting}>
                    {submitting ? "Placing order…" : `Place Order · ${formatINR(totals.total)}`}
                  </Button>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Sticky summary */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card">
            <h2 className="font-display text-xl text-botanical-900">Summary</h2>
            <ul className="mt-4 space-y-3">
              {cart.map((l) => (
                <li key={l.productId} className="flex items-center gap-3">
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream">
                    <Image src={l.image} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-charcoal">
                    {l.name} <span className="text-muted">× {l.quantity}</span>
                  </span>
                  <span className="text-sm font-bold text-botanical-900">{formatINR(l.price * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2.5 border-t border-sand-deep/60 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-charcoal-soft">Subtotal</dt><dd className="font-bold">{formatINR(totals.subtotal)}</dd></div>
              <div className="flex justify-between text-xs text-muted">
                <dt>
                  GST included{" "}
                  {totals.gstBreakdown.igst > 0
                    ? "(IGST)"
                    : "(CGST + SGST)"}
                </dt>
                <dd>{formatINR(totals.gst)}</dd>
              </div>
              {totals.gstBreakdown.igst === 0 && (
                <div className="flex justify-between text-[11px] text-muted">
                  <dt>CGST {formatINR(totals.gstBreakdown.cgst)} · SGST {formatINR(totals.gstBreakdown.sgst)}</dt>
                  <dd />
                </div>
              )}
              <div className="flex justify-between"><dt className="text-charcoal-soft">Shipping</dt><dd className={`font-bold ${totals.shipping === 0 ? "text-success" : ""}`}>{totals.shipping === 0 ? "Free" : formatINR(totals.shipping)}</dd></div>
              <div className="flex justify-between border-t border-sand-deep/60 pt-3 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-extrabold text-botanical-900">{formatINR(totals.total)}</dd>
              </div>
            </dl>
            <p className="mt-5 flex items-center gap-2 rounded-xl bg-cream px-3.5 py-2.5 text-[11px] text-charcoal-soft">
              <ShieldCheck size={14} className="shrink-0 text-botanical-700" />
              Prices and stock are re-verified on our servers when you place the order.
            </p>
          </div>
          {!hydrated && <ButtonLink href="/products" variant="ghost" className="mt-3 w-full">Loading…</ButtonLink>}
        </aside>
      </div>
    </div>
  );
}
