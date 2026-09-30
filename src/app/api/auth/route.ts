import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  getCurrentUser,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

// Naive in-memory rate limiter per runtime instance
const attempts = new Map<string, { count: number; ts: number }>();
function rateLimited(key: string, max = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.ts > windowMs) {
    attempts.set(key, { count: 1, ts: now });
    return false;
  }
  entry.count++;
  return entry.count > max;
}

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action as string;
    const ip = req.headers.get("x-forwarded-for") ?? "local";

    if (action === "logout") {
      await destroySession();
      return NextResponse.json({ ok: true });
    }

    if (rateLimited(`${ip}:${action}`)) {
      return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });
    }

    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });

    if (action === "register") {
      const name = String(body.name ?? "").trim();
      const phone = String(body.phone ?? "").trim();
      if (name.length < 2)
        return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
      if (password.length < 8)
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
      if (existing.length)
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      const [user] = await db
        .insert(users)
        .values({ name, email, phone, passwordHash: hashPassword(password) })
        .returning({ id: users.id, name: users.name, email: users.email });
      await createSession(user.id);
      return NextResponse.json({ user });
    }

    if (action === "login") {
      const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
      const user = rows[0];
      if (!user || !verifyPassword(password, user.passwordHash))
        return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
      await createSession(user.id);
      return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
