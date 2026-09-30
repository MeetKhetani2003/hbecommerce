"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-sand-deep bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-botanical-500";
  const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal-soft";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center">
        <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-botanical-700 text-ivory">
          <Leaf size={20} />
        </span>
        <h1 className="font-display text-3xl text-botanical-900">Create your account</h1>
        <p className="mt-2 text-sm text-muted">Begin your wellness journey with HB Lifecare.</p>
      </div>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-3xl border border-sand-deep/60 bg-white p-7 shadow-card">
        {error && (
          <p role="alert" className="rounded-xl border border-danger/25 bg-danger/5 px-4 py-2.5 text-sm font-semibold text-danger">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="name" className={labelCls}>Name</label>
          <input id="name" required className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input id="email" type="email" required className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Mobile</label>
          <input id="phone" type="tel" className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="password" className={labelCls}>Password</label>
          <input id="password" type="password" required minLength={8} className={inputCls} value={form.password} onChange={(e) => set("password", e.target.value)} autoComplete="new-password" />
          <p className="mt-1 text-[11px] text-muted">At least 8 characters. Stored securely (hashed).</p>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create Account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-charcoal-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-botanical-700 underline underline-offset-4">
          Login
        </Link>
      </p>
    </div>
  );
}
