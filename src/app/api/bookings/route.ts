import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, services, contactMessages } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Contact form submissions share this handler namespace? No — separate branch by type
    if (body.type === "contact") {
      const { name, email, phone, subject, message } = body;
      if (!name || String(name).trim().length < 2)
        return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
      if (!message || String(message).trim().length < 5)
        return NextResponse.json({ error: "Please enter a message." }, { status: 400 });
      await db.insert(contactMessages).values({
        name: String(name).trim(),
        email: String(email ?? "").trim(),
        phone: String(phone ?? "").trim(),
        subject: String(subject ?? "").trim(),
        message: String(message).trim(),
      });
      return NextResponse.json({ ok: true });
    }

    const { serviceSlug, name, email, phone, preferredDate, preferredTime, notes } = body;
    if (!name || String(name).trim().length < 2)
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    if (!phone || String(phone).replace(/\D/g, "").length < 10)
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    if (!preferredDate || !preferredTime)
      return NextResponse.json({ error: "Please choose a preferred date and time." }, { status: 400 });

    const rows = await db.select().from(services).where(eq(services.slug, String(serviceSlug))).limit(1);
    const service = rows[0];
    if (!service || !service.bookingEnabled)
      return NextResponse.json({ error: "This service is not currently bookable." }, { status: 400 });

    const [booking] = await db
      .insert(bookings)
      .values({
        serviceId: service.id,
        serviceTitle: service.title,
        name: String(name).trim(),
        email: String(email ?? "").trim(),
        phone: String(phone).trim(),
        preferredDate: String(preferredDate),
        preferredTime: String(preferredTime),
        notes: String(notes ?? "").trim(),
        // Consultation-to-product workflow starts in practitioner review
        status: "PENDING_PRACTITIONER_REVIEW",
      })
      .returning({ id: bookings.id });

    return NextResponse.json({ ok: true, bookingId: booking.id });
  } catch {
    return NextResponse.json({ error: "Could not submit request. Please try again." }, { status: 500 });
  }
}
