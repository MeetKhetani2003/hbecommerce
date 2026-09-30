"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatINR, discountPercent } from "@/lib/format";
import { RatingStars } from "@/components/ui";
import { useStore } from "@/components/providers/StoreProvider";

const CATEGORY_LABELS: Record<string, string> = {
  "internal-supplements": "Internal Supplement",
  "topical-care": "Topical Care",
  "eco-hygiene": "Eco Hygiene",
};

/**
 * MASTER ProductCard — the single card component used across the
 * entire platform (home, listing, search, related, wishlist, etc).
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);
  const off = discountPercent(product.price, product.compareAtPrice);
  const trustBadge = product.badges[0];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-sand-deep/50 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-cream"
        aria-label={product.name}
        tabIndex={-1}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        {off !== null && (
          <span className="absolute left-3 top-3 rounded-full bg-botanical-700 px-2.5 py-1 text-[11px] font-bold text-ivory">
            {off}% OFF
          </span>
        )}
      </Link>

      {/* Wishlist */}
      <button
        type="button"
        aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={wishlisted}
        onClick={() => toggleWishlist(product)}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all duration-200 ${
          wishlisted
            ? "bg-danger text-white shadow-md"
            : "bg-white/85 text-charcoal-soft opacity-90 shadow-sm hover:text-danger group-hover:opacity-100"
        }`}
      >
        <Heart size={16} fill={wishlisted ? "currentColor" : "none"} className={wishlisted ? "animate-pop" : ""} />
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-700">
          {CATEGORY_LABELS[product.categorySlug] ?? product.categorySlug}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-1.5 line-clamp-1 text-[15px] font-bold text-charcoal transition-colors hover:text-botanical-800"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-1 text-xs text-muted">{product.shortDescription}</p>

        <RatingStars rating={Number(product.rating)} reviewCount={product.reviewCount} className="mt-2" />

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-botanical-900">{formatINR(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-[13px] text-muted line-through">{formatINR(product.compareAtPrice)}</span>
          )}
        </div>

        {trustBadge && (
          <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-botanical-700">
            <span className="h-1 w-1 rounded-full bg-gold-500" aria-hidden="true" />
            {trustBadge}
          </p>
        )}

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-botanical-700 bg-white px-4 py-2.5 text-[13px] font-bold uppercase tracking-wider text-botanical-800 transition-all duration-200 hover:bg-botanical-700 hover:text-ivory active:scale-[0.98] disabled:opacity-50"
          >
            <ShoppingBag size={15} />
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[];
  columns?: 3 | 4;
}) {
  const cols =
    columns === 4
      ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
      : "grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid ${cols} gap-3 sm:gap-5`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
