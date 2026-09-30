import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { inArray, eq, sql } from "drizzle-orm";
import { computeTotals } from "@/lib/format";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type IncomingItem = { productId: number; quantity: number };

/**
 * Order creation with SERVER-SIDE price, GST and inventory validation.
 * Client-submitted prices are never trusted.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: IncomingItem[] = Array.isArray(body.items) ? body.items : [];
    const { name, email, phone, address, paymentMethod } = body;

    if (!items.length) return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    if (!name || typeof name !== "string" || name.trim().length < 2)
      return NextResponse.json({ error: "Please provide your full name." }, { status: 400 });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
    if (!phone || String(phone).replace(/\D/g, "").length < 10)
      return NextResponse.json({ error: "Please provide a valid phone number." }, { status: 400 });
    if (!address?.line1 || !address?.city || !address?.state || !address?.pincode)
      return NextResponse.json({ error: "Please complete the delivery address." }, { status: 400 });
    if (!/^\d{6}$/.test(String(address.pincode)))
      return NextResponse.json({ error: "PIN code must be 6 digits." }, { status: 400 });

    const ids = [...new Set(items.map((i) => Number(i.productId)))].filter(Boolean);
    const rows = await db.select().from(products).where(inArray(products.id, ids));
    const byId = new Map(rows.map((r) => [r.id, r]));

    const lines: {
      productId: number;
      name: string;
      image: string;
      price: number;
      quantity: number;
      gstRate: string;
    }[] = [];

    for (const item of items) {
      const p = byId.get(Number(item.productId));
      const qty = Math.max(1, Math.min(10, Number(item.quantity) || 1));
      if (!p || !p.isActive)
        return NextResponse.json({ error: "A product in your cart is unavailable." }, { status: 400 });
      if (p.stock < qty)
        return NextResponse.json(
          { error: `Insufficient stock for ${p.name}. Only ${p.stock} left.` },
          { status: 400 }
        );
      lines.push({
        productId: p.id,
        name: p.name,
        image: p.image,
        price: p.price, // authoritative server price
        quantity: qty,
        gstRate: String(p.gstRate),
      });
    }

    const totals = computeTotals(lines, String(address.state));
    const user = await getCurrentUser();
    const orderNumber = `HB${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;
    const method = paymentMethod === "COD" ? "COD" : "COD"; // only COD is currently configured

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: user?.id ?? null,
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        customerName: String(name).trim(),
        shippingAddress: {
          fullName: String(name).trim(),
          phone: String(phone).trim(),
          line1: String(address.line1).trim(),
          line2: String(address.line2 ?? "").trim(),
          city: String(address.city).trim(),
          state: String(address.state).trim(),
          pincode: String(address.pincode).trim(),
        },
        subtotal: totals.subtotal,
        discount: 0,
        gst: totals.gst,
        gstBreakdown: totals.gstBreakdown,
        shipping: totals.shipping,
        total: totals.total,
        paymentMethod: method,
        paymentStatus: "PENDING",
        orderStatus: "PLACED",
      })
      .returning();

    await db.insert(orderItems).values(
      lines.map((l) => ({
        orderId: order.id,
        productId: l.productId,
        productName: l.name,
        productImage: l.image,
        unitPrice: l.price,
        quantity: l.quantity,
        gstRate: l.gstRate,
        lineTotal: l.price * l.quantity,
      }))
    );

    // Decrement inventory
    for (const l of lines) {
      await db
        .update(products)
        .set({ stock: sql`${products.stock} - ${l.quantity}` })
        .where(eq(products.id, l.productId));
    }

    return NextResponse.json({ orderNumber: order.orderNumber, id: order.id });
  } catch {
    return NextResponse.json({ error: "Could not place order. Please try again." }, { status: 500 });
  }
}
