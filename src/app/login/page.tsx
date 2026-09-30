"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-sand-deep bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-botanical-500";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center">
        <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-botanical-700 text-ivory">
          <Leaf size={20} />
        </span>
        <h1 className="font-display text-3xl text-botanical-900">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Sign in to your HB Lifecare account.</p>
      </div>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-3xl border border-sand-deep/60 bg-white p-7 shadow-card">
        {error && (
          <p role="alert" className="rounded-xl border border-danger/25 bg-danger/5 px-4 py-2.5 text-sm font-semibold text-danger">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal-soft">
            Email
          </label>
          <input id="email" type="email" required className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-charcoal-soft">
            Password
          </label>
          <input id="password" type="password" required className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </div>
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-charcoal-soft">
            <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-botanical-700" /> Remember me
          </label>
          <span className="text-muted" title="Contact us to reset your password">Forgot password?</span>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </Button>
        <p className="text-center text-xs text-muted">
          Google login will appear here once configured by the business.
        </p>
      </form>
      <p className="mt-6 text-center text-sm text-charcoal-soft">
        New to HB Lifecare?{" "}
        <Link href="/register" className="font-bold text-botanical-700 underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </div>
  );
}
