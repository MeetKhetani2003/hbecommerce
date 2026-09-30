"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, ShoppingBag, Zap, ShieldCheck, Truck, PackageCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR, discountPercent, FREE_SHIPPING_THRESHOLD } from "@/lib/format";
import { RatingStars, QuantitySelector, Badge, Button } from "@/components/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { BRAND } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  "internal-supplements": "Internal Supplement",
  "topical-care": "Topical Care",
  "eco-hygiene": "Eco Hygiene",
};

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const wishlisted = isWishlisted(product.id);
  const off = discountPercent(product.price, product.compareAtPrice);
  const gallery = product.images.length ? product.images : [product.image];

  const buyNow = () => {
    addToCart(product, qty, false);
    router.push("/checkout");
  };

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[55%_1fr] lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream shadow-card">
            <Image
              src={gallery[activeImage]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            {off !== null && (
              <span className="absolute left-4 top-4 rounded-full bg-botanical-700 px-3 py-1.5 text-xs font-bold text-ivory">
                {off}% OFF
              </span>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 flex gap-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`View image ${i + 1}`}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors ${
                    i === activeImage ? "border-botanical-700" : "border-transparent hover:border-sand-deep"
                  }`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-700">
              {CATEGORY_LABELS[product.categorySlug] ?? product.categorySlug} · {product.brand}
            </p>
          </div>
          <h1 className="font-display mt-3 text-3xl text-botanical-900 sm:text-4xl">{product.name}</h1>
          <RatingStars rating={Number(product.rating)} reviewCount={product.reviewCount} className="mt-3" size={16} />

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-botanical-900">{formatINR(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-lg text-muted line-through">{formatINR(product.compareAtPrice)}</span>
                <span className="text-sm font-bold text-success">{off}% off</span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted">Inclusive of GST · SKU: {product.sku}</p>

          <p className="mt-5 text-[15px] leading-relaxed text-charcoal-soft">{product.shortDescription}</p>

          {product.badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.badges.map((b) => (
                <Badge key={b} tone="gold">
                  {b}
                </Badge>
              ))}
            </div>
          )}

          {/* Highlights */}
          {product.benefits.length > 0 && (
            <ul className="mt-6 space-y-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-charcoal-soft">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          <p className={`mt-6 text-sm font-bold ${product.stock > 0 ? "text-success" : "text-danger"}`}>
            {product.stock > 10 ? "✓ In stock" : product.stock > 0 ? `Only ${product.stock} left in stock` : "Out of stock"}
          </p>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <QuantitySelector value={qty} onChange={(v) => setQty(Math.max(1, Math.min(10, v)))} />
            <button
              type="button"
              aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={wishlisted}
              onClick={() => toggleWishlist(product)}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                wishlisted
                  ? "border-danger bg-danger text-white"
                  : "border-sand-deep bg-white text-charcoal-soft hover:border-danger hover:text-danger"
              }`}
            >
              <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button size="lg" onClick={() => addToCart(product, qty)} disabled={product.stock <= 0}>
              <ShoppingBag size={17} /> Add to Cart
            </Button>
            <Button size="lg" variant="gold" onClick={buyNow} disabled={product.stock <= 0}>
              <Zap size={17} /> Buy Now
            </Button>
          </div>

          {/* Trust row */}
          <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-sand-deep/60 bg-cream/70 p-4 text-center">
            {[
              { icon: Truck, label: `Free shipping over ${formatINR(FREE_SHIPPING_THRESHOLD)}` },
              { icon: ShieldCheck, label: "Secure checkout" },
              { icon: PackageCheck, label: "Carefully packed" },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-1.5">
                <t.icon size={18} className="text-botanical-700" />
                <span className="text-[11px] font-semibold leading-tight text-charcoal-soft">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <DetailTabs product={product} />

      {/* Sticky mobile add-to-cart */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-sand-deep/60 bg-ivory/95 p-3 backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-charcoal">{product.name}</p>
          <p className="text-sm font-extrabold text-botanical-900">{formatINR(product.price)}</p>
        </div>
        <Button size="md" onClick={() => addToCart(product, qty)} disabled={product.stock <= 0}>
          <ShoppingBag size={15} /> Add to Cart
        </Button>
      </div>
    </>
  );
}

function DetailTabs({ product }: { product: Product }) {
  const tabs = [
    { id: "overview", label: "Overview", content: product.description },
    {
      id: "ingredients",
      label: "Ingredients",
      content:
        product.ingredients.length > 0
          ? product.ingredients.join("\n")
          : "Full composition details are being finalised by the business. Contact us for the complete ingredient sheet. [CMS-editable]",
    },
    {
      id: "usage",
      label: "How to Use",
      content: product.usage || "Directions are provided on the pack. [CMS-editable]",
    },
    {
      id: "benefits",
      label: "Benefits / Intended Use",
      content:
        (product.benefits.length ? product.benefits.map((b) => `• ${b}`).join("\n") + "\n\n" : "") +
        "These descriptions reflect the brand's intended wellness use and traditional-use context. They are not medical claims.",
    },
    {
      id: "info",
      label: "Product Information",
      content: `Brand: ${product.brand}\nSKU: ${product.sku}\nHSN Code: ${product.hsnCode || "—"}\nGST Rate: ${Number(product.gstRate)}% (included in price)\nMarketed by: HB Lifecare, ${BRAND.address}\nGSTIN: ${BRAND.gstin}`,
    },
    {
      id: "shipping",
      label: "Shipping & Returns",
      content: `${product.shippingInfo || "Ships across India."}\n\n${product.returnInfo || "See Refund Policy for business-approved terms."}`,
    },
    {
      id: "faq",
      label: "FAQs",
      content:
        "Q: How can I get the full composition sheet?\nA: Contact us via WhatsApp or the contact form and we'll share the product's complete information.\n\nQ: Is this a substitute for medical treatment?\nA: No. " +
        BRAND.disclaimer,
    },
  ];
  const [active, setActive] = useState("overview");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <section className="mt-16" aria-label="Product details">
      <div className="hb-scroll flex gap-1 overflow-x-auto border-b border-sand-deep/60" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            className={`whitespace-nowrap px-4 py-3 text-sm font-bold transition-colors ${
              active === t.id
                ? "border-b-2 border-botanical-700 text-botanical-800"
                : "text-muted hover:text-charcoal"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="max-w-3xl whitespace-pre-line py-7 text-[15px] leading-relaxed text-charcoal-soft">
        {current.content}
      </div>
      <p className="max-w-3xl rounded-2xl border border-gold-500/25 bg-gold-500/5 p-4 text-xs leading-relaxed text-charcoal-soft">
        {BRAND.disclaimer}
      </p>
    </section>
  );
}
