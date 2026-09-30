import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl text-botanical-900">My Account</h1>
      <p className="mt-2 text-sm text-muted">
        Welcome back, <span className="font-bold text-charcoal">{user.name}</span>
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <AccountSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
