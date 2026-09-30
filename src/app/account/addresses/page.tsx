import { MapPin } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { addresses, orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { EmptyState } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const user = (await getCurrentUser())!;
  const saved = await db.select().from(addresses).where(eq(addresses.userId, user.id));
  const recentOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))
    .limit(3);

  const fromOrders = recentOrders.map((o) => o.shippingAddress);

  if (saved.length === 0 && fromOrders.length === 0) {
    return (
      <EmptyState
        icon={<MapPin size={30} />}
        title="No saved addresses yet."
        message="Addresses used at checkout will appear here."
        cta={{ label: "Explore Products", href: "/products" }}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {saved.map((a) => (
        <address key={a.id} className="rounded-3xl border border-sand-deep/60 bg-white p-6 not-italic shadow-card">
          <p className="text-xs font-bold uppercase tracking-wider text-gold-700">{a.label}</p>
          <p className="mt-2 text-sm font-bold text-charcoal">{a.fullName}</p>
          <p className="mt-1 text-sm leading-relaxed text-charcoal-soft">
            {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} — {a.pincode}
          </p>
          <p className="mt-2 text-xs text-muted">{a.phone}</p>
        </address>
      ))}
      {fromOrders.map((a, i) => (
        <address key={`o-${i}`} className="rounded-3xl border border-sand-deep/60 bg-white p-6 not-italic shadow-card">
          <p className="text-xs font-bold uppercase tracking-wider text-gold-700">From recent order</p>
          <p className="mt-2 text-sm font-bold text-charcoal">{a.fullName}</p>
          <p className="mt-1 text-sm leading-relaxed text-charcoal-soft">
            {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} — {a.pincode}
          </p>
          <p className="mt-2 text-xs text-muted">{a.phone}</p>
        </address>
      ))}
    </div>
  );
}
