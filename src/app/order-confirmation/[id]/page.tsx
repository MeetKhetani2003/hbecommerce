import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Phone } from "lucide-react";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatINR } from "@/lib/format";
import { ButtonLink } from "@/components/ui";
import { BRAND } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db.select().from(orders).where(eq(orders.orderNumber, id)).limit(1);
  const order = rows[0];
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="mx-auto mb-6 flex h-18 w-18 items-center justify-center rounded-full bg-botanical-50 text-success" style={{ width: 72, height: 72 }}>
          <CheckCircle2 size={36} />
        </span>
        <h1 className="font-display text-4xl text-botanical-900">Thank you, {order.customerName.split(" ")[0]}.</h1>
        <p className="mt-3 text-sm text-charcoal-soft">
          Your order <strong className="text-botanical-800">{order.orderNumber}</strong> has been placed.
          We&apos;ll confirm dispatch details on <strong>{order.phone}</strong>.
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card sm:p-8">
        <h2 className="font-display text-xl text-botanical-900">Order Details</h2>
        <ul className="mt-4 divide-y divide-sand-deep/50">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-4 py-3.5">
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                {it.productImage && <Image src={it.productImage} alt="" fill sizes="56px" className="object-cover" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-charcoal">{it.productName}</span>
                <span className="text-xs text-muted">Qty {it.quantity} · {formatINR(it.unitPrice)} each</span>
              </span>
              <span className="text-sm font-bold text-botanical-900">{formatINR(it.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-sand-deep/60 pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-charcoal-soft">Subtotal</dt><dd className="font-bold">{formatINR(order.subtotal)}</dd></div>
          <div className="flex justify-between text-xs text-muted">
            <dt>
              GST included —{" "}
              {order.gstBreakdown.igst > 0
                ? `IGST ${formatINR(order.gstBreakdown.igst)}`
                : `CGST ${formatINR(order.gstBreakdown.cgst)} + SGST ${formatINR(order.gstBreakdown.sgst)}`}
            </dt>
            <dd>{formatINR(order.gst)}</dd>
          </div>
          <div className="flex justify-between"><dt className="text-charcoal-soft">Shipping</dt><dd className="font-bold">{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</dd></div>
          <div className="flex justify-between border-t border-sand-deep/60 pt-3 text-base">
            <dt className="font-bold">Total ({order.paymentMethod})</dt>
            <dd className="font-extrabold text-botanical-900">{formatINR(order.total)}</dd>
          </div>
        </dl>
        <div className="mt-6 rounded-2xl bg-cream p-4 text-xs leading-relaxed text-charcoal-soft">
          <p className="font-bold text-charcoal">Delivery address</p>
          <p className="mt-1">
            {order.shippingAddress.fullName}, {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.state} — {order.shippingAddress.pincode}
          </p>
          <p className="mt-2 text-muted">GSTIN: {BRAND.gstin} · GST-ready invoice available on request.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/products">Continue Shopping</ButtonLink>
        <Link
          href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hello, I have a question about my order ${order.orderNumber}.`)}`}
          className="inline-flex items-center gap-2 rounded-full border border-botanical-700/40 px-6 py-3 text-sm font-semibold text-botanical-800 hover:bg-botanical-50"
        >
          <Phone size={15} /> Ask on WhatsApp
        </Link>
      </div>
    </div>
  );
}
