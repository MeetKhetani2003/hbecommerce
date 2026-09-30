import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
