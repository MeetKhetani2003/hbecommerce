"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X, Search } from "lucide-react";
import type { Product, Category } from "@/lib/types";
import { ProductGrid } from "./ProductCard";
import { Button, EmptyState } from "@/components/ui";
import { Leaf } from "lucide-react";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name A–Z" },
] as const;

const PRICE_BANDS = [
  { value: "0-199", label: "Under ₹200" },
  { value: "200-499", label: "₹200 – ₹499" },
  { value: "500-799", label: "₹500 – ₹799" },
  { value: "800-99999", label: "₹800 & above" },
];

const BRANDS = ["HB Lifecare", "Herbivia Botanica"];

export function CatalogView({
  products,
  categories,
  lockedCategory,
}: {
  products: Product[];
  categories: Category[];
  lockedCategory?: string;
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string>("featured");
  const [cats, setCats] = useState<string[]>([]);
  const [bands, setBands] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(12);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const filtered = useMemo(() => {
    let out = [...products];
    const q = search.trim().toLowerCase();
    if (q)
      out = out.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    if (cats.length) out = out.filter((p) => cats.includes(p.categorySlug));
    if (brands.length) out = out.filter((p) => brands.includes(p.brand));
    if (inStockOnly) out = out.filter((p) => p.stock > 0);
    if (bands.length)
      out = out.filter((p) =>
        bands.some((b) => {
          const [min, max] = b.split("-").map(Number);
          return p.price >= min && p.price <= max;
        })
      );
    switch (sort) {
      case "price-asc":
        out.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        out.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        out.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case "name":
        out.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        out.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return out;
  }, [products, search, sort, cats, bands, brands, inStockOnly]);

  const activeChips = [
    ...cats.map((c) => ({
      key: `cat:${c}`,
      label: categories.find((x) => x.slug === c)?.name ?? c,
      clear: () => toggle(cats, setCats, c),
    })),
    ...bands.map((b) => ({
      key: `band:${b}`,
      label: PRICE_BANDS.find((x) => x.value === b)?.label ?? b,
      clear: () => toggle(bands, setBands, b),
    })),
    ...brands.map((b) => ({ key: `brand:${b}`, label: b, clear: () => toggle(brands, setBrands, b) })),
    ...(inStockOnly ? [{ key: "stock", label: "In stock", clear: () => setInStockOnly(false) }] : []),
  ];

  const clearAll = () => {
    setCats([]);
    setBands([]);
    setBrands([]);
    setInStockOnly(false);
    setSearch("");
  };

  const filterPanel = (
    <div className="space-y-7">
      {!lockedCategory && (
        <fieldset>
          <legend className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-charcoal">Category</legend>
          <div className="space-y-2.5">
            {categories.map((c) => (
              <label key={c.slug} className="flex cursor-pointer items-center gap-2.5 text-sm text-charcoal-soft">
                <input
                  type="checkbox"
                  checked={cats.includes(c.slug)}
                  onChange={() => toggle(cats, setCats, c.slug)}
                  className="h-4 w-4 accent-botanical-700"
                />
                {c.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset>
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-charcoal">Price</legend>
        <div className="space-y-2.5">
          {PRICE_BANDS.map((b) => (
            <label key={b.value} className="flex cursor-pointer items-center gap-2.5 text-sm text-charcoal-soft">
              <input
                type="checkbox"
                checked={bands.includes(b.value)}
                onChange={() => toggle(bands, setBands, b.value)}
                className="h-4 w-4 accent-botanical-700"
              />
              {b.label}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-charcoal">Brand</legend>
        <div className="space-y-2.5">
          {BRANDS.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2.5 text-sm text-charcoal-soft">
              <input
                type="checkbox"
                checked={brands.includes(b)}
                onChange={() => toggle(brands, setBrands, b)}
                className="h-4 w-4 accent-botanical-700"
              />
              {b}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-charcoal">Availability</legend>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-charcoal-soft">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly(!inStockOnly)}
            className="h-4 w-4 accent-botanical-700"
          />
          In stock only
        </label>
      </fieldset>
      <button type="button" onClick={clearAll} className="text-xs font-bold text-danger underline underline-offset-4">
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block" aria-label="Product filters">
        <div className="sticky top-24 rounded-2xl border border-sand-deep/60 bg-white/70 p-6">{filterPanel}</div>
      </aside>

      <div>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1 basis-56">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in shop…"
              aria-label="Search products"
              className="w-full rounded-full border border-sand-deep bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-botanical-500"
            />
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-muted">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort products"
              className="rounded-full border border-sand-deep bg-white px-4 py-2.5 text-sm font-semibold text-charcoal outline-none focus:border-botanical-500"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-sand-deep bg-white px-4 py-2.5 text-sm font-semibold text-charcoal lg:hidden"
          >
            <SlidersHorizontal size={15} /> Filters
            {activeChips.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-botanical-700 text-[10px] font-bold text-ivory">
                {activeChips.length}
              </span>
            )}
          </button>
        </div>

        {/* Active chips + count */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <p className="mr-2 text-xs text-muted">
            {filtered.length} product{filtered.length === 1 ? "" : "s"}
          </p>
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              className="inline-flex items-center gap-1.5 rounded-full bg-botanical-50 px-3 py-1 text-xs font-semibold text-botanical-800 hover:bg-botanical-100"
            >
              {chip.label} <X size={12} />
            </button>
          ))}
          {activeChips.length > 1 && (
            <button type="button" onClick={clearAll} className="text-xs font-bold text-danger underline underline-offset-4">
              Clear all
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="mt-6">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Leaf size={30} />}
              title="No products match your filters."
              message="Try clearing a filter or searching for something else."
            />
          ) : (
            <>
              <ProductGrid products={filtered.slice(0, visible)} columns={lockedCategory ? 3 : 4} />
              {filtered.length > visible && (
                <div className="mt-10 text-center">
                  <Button variant="secondary" onClick={() => setVisible((v) => v + 12)}>
                    Load more products
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter bottom sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-80 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            className="animate-fade-in absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="animate-sheet-up absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-ivory p-6 pb-28 shadow-drawer">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl text-botanical-900">Filters</h2>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal hover:bg-botanical-50"
              >
                <X size={20} />
              </button>
            </div>
            {filterPanel}
            <div className="fixed inset-x-0 bottom-0 flex gap-3 border-t border-sand-deep/60 bg-ivory p-4">
              <Button variant="secondary" className="flex-1" onClick={clearAll}>
                Clear all
              </Button>
              <Button className="flex-1" onClick={() => setMobileOpen(false)}>
                Apply filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
