import Link from "next/link";
import { Package, MapPin, Heart, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { orders, addresses } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { formatINR } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AccountOverviewPage() {
  const user = (await getCurrentUser())!;
  const [orderCountRow] = await db
    .select({ n: count() })
    .from(orders)
    .where(eq(orders.userId, user.id));
  const [addressCountRow] = await db
    .select({ n: count() })
    .from(addresses)
    .where(eq(addresses.userId, user.id));
  const recent = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))
    .limit(3);

  const cards = [
    { label: "Orders", value: orderCountRow?.n ?? 0, icon: Package, href: "/account/orders" },
    { label: "Saved Addresses", value: addressCountRow?.n ?? 0, icon: MapPin, href: "/account/addresses" },
    { label: "Wishlist", value: "View", icon: Heart, href: "/wishlist" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <c.icon size={20} className="text-botanical-700" />
            <p className="mt-3 text-2xl font-extrabold text-botanical-900">{c.value}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted">
              {c.label} <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </p>
          </Link>
        ))}
      </div>

      <section className="rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-xl text-botanical-900">Recent Orders</h2>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            No orders yet.{" "}
            <Link href="/products" className="font-bold text-botanical-700 underline underline-offset-4">
              Explore products
            </Link>{" "}
            to place your first order.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-sand-deep/50">
            {recent.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-bold text-charcoal">{o.orderNumber}</p>
                  <p className="text-xs text-muted">{o.createdAt.toLocaleDateString("en-IN")} · {o.orderStatus}</p>
                </div>
                <p className="text-sm font-extrabold text-botanical-900">{formatINR(o.total)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
