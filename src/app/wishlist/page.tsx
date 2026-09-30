"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { ProductGrid } from "@/components/product/ProductCard";
import { EmptyState, Breadcrumbs } from "@/components/ui";
import type { Product } from "@/lib/types";

export default function WishlistPage() {
  const { wishlist, hydrated } = useStore();
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setAll(d.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  const items = all.filter((p) => wishlist.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="font-display mt-5 text-4xl text-botanical-900">Your Wishlist</h1>

      {(!hydrated || loading) && (
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-sand/70" />
          ))}
        </div>
      )}

      {hydrated && !loading && items.length === 0 && (
        <EmptyState
          icon={<Heart size={30} />}
          title="Your wishlist is waiting for something special."
          message="Tap the heart on any product to save it here."
          cta={{ label: "Explore Products", href: "/products" }}
        />
      )}

      {hydrated && !loading && items.length > 0 && (
        <div className="mt-10">
          <ProductGrid products={items} />
        </div>
      )}
    </div>
  );
}
