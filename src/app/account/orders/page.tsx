import Link from "next/link";
import { Package } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { formatINR } from "@/lib/format";
import { EmptyState, Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = (await getCurrentUser())!;
  const list = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt));
  const items = list.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, list.map((o) => o.id)))
    : [];

  if (list.length === 0) {
    return (
      <EmptyState
        icon={<Package size={30} />}
        title="No orders yet."
        message="Orders placed while signed in will appear here."
        cta={{ label: "Explore Products", href: "/products" }}
      />
    );
  }

  return (
    <div className="space-y-5">
      {list.map((o) => {
        const its = items.filter((i) => i.orderId === o.id);
        return (
          <article key={o.id} className="rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <Link href={`/order-confirmation/${o.orderNumber}`} className="text-sm font-bold text-botanical-800 underline underline-offset-4">
                  {o.orderNumber}
                </Link>
                <p className="mt-0.5 text-xs text-muted">{o.createdAt.toLocaleDateString("en-IN")}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={o.orderStatus === "PLACED" ? "sage" : "gold"}>{o.orderStatus}</Badge>
                <p className="text-sm font-extrabold text-botanical-900">{formatINR(o.total)}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal-soft">
              {its.map((i) => `${i.productName} × ${i.quantity}`).join(" · ")}
            </p>
          </article>
        );
      })}
    </div>
  );
}
