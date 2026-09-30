"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Trash2, Heart, ArrowRight } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { formatINR, computeTotals, FREE_SHIPPING_THRESHOLD } from "@/lib/format";
import { QuantitySelector, EmptyState, ButtonLink, Breadcrumbs, SectionHeading } from "@/components/ui";
import { ProductGrid } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

export default function CartPage() {
  const { cart, hydrated, updateQuantity, removeFromCart, pushToast } = useStore();
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const all: Product[] = d.products ?? [];
        const inCart = new Set(cart.map((l) => l.productId));
        setRecommended(all.filter((p) => !inCart.has(p.id) && p.featured).slice(0, 4));
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const totals = computeTotals(cart);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded-full bg-sand" />
        <div className="mt-8 grid gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-sand/70" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="font-display mt-5 text-4xl text-botanical-900">Your Cart</h1>

      {cart.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={30} />}
          title="Your cart is waiting for something natural."
          message="Browse our herbal wellness collection to begin."
          cta={{ label: "Explore Products", href: "/products" }}
        />
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Items */}
          <ul className="divide-y divide-sand-deep/50 rounded-3xl border border-sand-deep/60 bg-white px-5 shadow-card sm:px-6">
            {cart.map((line) => (
              <li key={line.productId} className="flex gap-4 py-5 sm:gap-6">
                <Link
                  href={`/products/${line.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-cream"
                >
                  <Image src={line.image} alt={line.name} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/products/${line.slug}`} className="text-[15px] font-bold text-charcoal hover:text-botanical-800">
                      {line.name}
                    </Link>
                    <p className="text-[15px] font-extrabold text-botanical-900">
                      {formatINR(line.price * line.quantity)}
                    </p>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{formatINR(line.price)} each · GST included</p>
                  <div className="mt-3 flex items-center gap-2">
                    <QuantitySelector
                      size="sm"
                      value={line.quantity}
                      onChange={(v) => updateQuantity(line.productId, v)}
                    />
                    <button
                      type="button"
                      aria-label={`Move ${line.name} to wishlist`}
                      onClick={() => pushToast({ title: "Tip", message: "Use the ♡ on the product page to save items.", tone: "info" })}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-botanical-50 hover:text-botanical-700"
                    >
                      <Heart size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${line.name}`}
                      onClick={() => removeFromCart(line.productId)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-3xl border border-sand-deep/60 bg-white p-6 shadow-card">
              <h2 className="font-display text-xl text-botanical-900">Order Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-charcoal-soft">Subtotal</dt>
                  <dd className="font-bold text-charcoal">{formatINR(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-soft">Discount</dt>
                  <dd className="font-bold text-charcoal">— {formatINR(totals.discount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-soft">GST (included)</dt>
                  <dd className="text-charcoal-soft">{formatINR(totals.gst)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-charcoal-soft">Shipping</dt>
                  <dd className={`font-bold ${totals.shipping === 0 ? "text-success" : "text-charcoal"}`}>
                    {totals.shipping === 0 ? "Free" : formatINR(totals.shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-sand-deep/60 pt-4 text-base">
                  <dt className="font-bold text-charcoal">Grand Total</dt>
                  <dd className="font-extrabold text-botanical-900">{formatINR(totals.total)}</dd>
                </div>
              </dl>
              {totals.subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="mt-4 rounded-xl bg-cream px-3.5 py-2.5 text-xs text-charcoal-soft">
                  Add {formatINR(FREE_SHIPPING_THRESHOLD - totals.subtotal)} more for free shipping.
                </p>
              )}
              <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
                Proceed to Checkout <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/products" variant="ghost" className="mt-3 w-full">
                Continue Shopping
              </ButtonLink>
            </div>
          </aside>
        </div>
      )}

      {recommended.length > 0 && (
        <section className="mt-20">
          <SectionHeading eyebrow="Pairs Well" title="You May Also Like" align="left" />
          <div className="mt-8">
            <ProductGrid products={recommended} />
          </div>
        </section>
      )}
    </div>
  );
}
