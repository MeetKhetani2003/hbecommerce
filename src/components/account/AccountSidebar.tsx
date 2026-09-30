"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Heart, MapPin, UserCircle, CalendarHeart, Settings, LogOut } from "lucide-react";

const LINKS = [
  { label: "Overview", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile", href: "/account/profile", icon: UserCircle },
  { label: "Consultations", href: "/services", icon: CalendarHeart },
  { label: "Settings", href: "/account/profile", icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
    router.refresh();
  };

  return (
    <nav aria-label="Account navigation" className="h-fit rounded-3xl border border-sand-deep/60 bg-white p-3 shadow-card lg:sticky lg:top-24">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <li key={l.label} className="shrink-0">
              <Link
                href={l.href}
                className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                  active ? "bg-botanical-700 text-ivory" : "text-charcoal-soft hover:bg-botanical-50 hover:text-botanical-800"
                }`}
              >
                <l.icon size={16} /> {l.label}
              </Link>
            </li>
          );
        })}
        <li className="shrink-0">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger/10"
          >
            <LogOut size={16} /> Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
