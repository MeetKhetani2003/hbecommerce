"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Leaf,
} from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/format";

const MEGA_MENU = [
  {
    title: "Internal Supplements",
    href: "/products/internal-supplements",
    links: [
      { label: "CR 500 Drops", href: "/products/cr-500-drops" },
      { label: "Vitan+ Syrup", href: "/products/vitan-plus-syrup" },
      { label: "Livcarezymo Syrup", href: "/products/livcarezymo-syrup" },
      { label: "Arjun Chhal Ras", href: "/products/arjun-chhal-ras" },
      { label: "Madhu Control", href: "/products/madhu-control" },
      { label: "Triphala Juice", href: "/products/triphala-juice" },
      { label: "RE-EN Capsules", href: "/products/re-en-capsules" },
    ],
  },
  {
    title: "Topical Care",
    href: "/products/topical-care",
    links: [
      { label: "Joint Solution Pain Free Oil", href: "/products/joint-solution-pain-free-oil" },
      { label: "Nabhi Tailam", href: "/products/nabhi-tailam" },
      { label: "Neem Aloe Vera Facewash", href: "/products/neem-aloe-vera-facewash" },
      { label: "Skin Beauty Soap", href: "/products/skin-beauty-soap" },
    ],
  },
  {
    title: "Eco Hygiene",
    href: "/products/eco-hygiene",
    links: [
      { label: "Bamboo Sanitary Pads", href: "/products/bamboo-sanitary-pads" },
      { label: "Bamboo Tongue Cleaner", href: "/products/bamboo-tongue-cleaner" },
      { label: "Bamboo Brush", href: "/products/bamboo-brush" },
    ],
  },
  {
    title: "Wellness Services",
    href: "/services",
    links: [
      { label: "Advance Acupressure Therapy", href: "/services/advance-acupressure-therapy" },
      { label: "Naturopathy", href: "/services/naturopathy" },
      { label: "Distance Healing", href: "/services/distance-healing" },
      { label: "Chakra & Five Elements Alignment", href: "/services/chakra-five-elements-alignment" },
      { label: "Energy & Aura Balancing", href: "/services/energy-aura-balancing" },
    ],
  },
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products", mega: true },
  { label: "Wellness Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Logo({ light }: { light: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="HB Lifecare — Home">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-botanical-700 text-ivory">
        <Leaf size={17} />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-lg font-semibold tracking-wide ${light ? "text-ivory" : "text-botanical-900"}`}>
          HB Lifecare
        </span>
        <span className={`font-gurmukhi block text-[10px] tracking-wide ${light ? "text-ivory/80" : "text-gold-700"}`}>
          ਸਿਹਤਮੰਦ ਅਤੇ ਦਿਵਯਤਾ
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { cartCount, wishlist, hydrated, setCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !megaOpen && !mobileOpen && !searchOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  const openMega = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const iconBtn = `relative flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
    transparent ? "text-ivory hover:bg-white/15" : "text-charcoal hover:bg-botanical-50"
  }`;

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-botanical-900 px-4 py-2 text-center text-[11px] sm:text-xs font-medium tracking-wide text-ivory/90">
        Free shipping on orders above ₹699 · CR 500 Drops — 101% Money Back Guarantee*
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          transparent
            ? "bg-transparent"
            : "bg-ivory/95 shadow-[0_1px_0_rgba(38,40,31,0.07),0_8px_24px_rgba(38,40,31,0.06)] backdrop-blur-md"
        }`}
        onMouseLeave={closeMega}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo light={transparent} />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) =>
              link.mega ? (
                <div key={link.label} onMouseEnter={openMega} className="relative">
                  <Link
                    href={link.href}
                    aria-expanded={megaOpen}
                    aria-haspopup="true"
                    className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      transparent ? "text-ivory hover:bg-white/15" : "text-charcoal hover:bg-botanical-50 hover:text-botanical-800"
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
                  </Link>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    transparent
                      ? "text-ivory hover:bg-white/15"
                      : pathname === link.href
                        ? "text-botanical-800"
                        : "text-charcoal hover:bg-botanical-50 hover:text-botanical-800"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-0.5">
            <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)} className={iconBtn}>
              <Search size={19} />
            </button>
            <Link href="/account" aria-label="Account" className={`${iconBtn} hidden sm:flex`}>
              <User size={19} />
            </Link>
            <Link href="/wishlist" aria-label={`Wishlist${hydrated && wishlist.length ? `, ${wishlist.length} items` : ""}`} className={iconBtn}>
              <Heart size={19} />
              {hydrated && wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label={`Cart${hydrated && cartCount ? `, ${cartCount} items` : ""}`}
              onClick={() => setCartOpen(true)}
              className={iconBtn}
            >
              <ShoppingBag size={19} />
              {hydrated && cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-botanical-700 px-1 text-[10px] font-bold text-ivory">
                  {cartCount}
                </span>
              )}
            </button>
            <button type="button" aria-label="Open menu" onClick={() => setMobileOpen(true)} className={`${iconBtn} lg:hidden`}>
              <Menu size={21} />
            </button>
          </div>
        </div>

        {/* Mega menu */}
        {megaOpen && (
          <div
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
            className="animate-fade-in absolute inset-x-0 top-full hidden border-t border-sand-deep/50 bg-ivory shadow-card-hover lg:block"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-4 gap-10 px-8 py-10">
              {MEGA_MENU.map((col) => (
                <div key={col.title}>
                  <Link
                    href={col.href}
                    className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700 hover:text-gold-500 transition-colors"
                  >
                    {col.title}
                  </Link>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-sm text-charcoal-soft transition-colors hover:text-botanical-800">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={col.href}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-botanical-700 hover:text-botanical-900"
                  >
                    View all <ChevronRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-70 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Close menu"
            className="animate-fade-in absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="animate-drawer-in-left hb-scroll absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-ivory shadow-drawer">
            <div className="flex items-center justify-between border-b border-sand-deep/60 px-5 py-4">
              <Logo light={false} />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal hover:bg-botanical-50"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-5 py-6" aria-label="Mobile navigation">
              <ul className="space-y-1">
                {[
                  { label: "Home", href: "/" },
                  { label: "Shop All", href: "/products" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="block rounded-xl px-3 py-3 text-[15px] font-bold text-charcoal hover:bg-botanical-50">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {MEGA_MENU.map((col) => (
                <div key={col.title} className="mt-5">
                  <Link href={col.href} className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700">
                    {col.title}
                  </Link>
                  <ul className="mt-2 space-y-0.5">
                    {col.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="block rounded-xl px-3 py-2 text-sm text-charcoal-soft hover:bg-botanical-50 hover:text-botanical-800">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="mt-6 space-y-1 border-t border-sand-deep/60 pt-5">
                {[
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/contact" },
                  { label: "FAQ", href: "/faq" },
                  { label: "My Account", href: "/account" },
                ].map((l) => (
                  <Link key={l.href} href={l.href} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-charcoal hover:bg-botanical-50">
                    {l.label}
                  </Link>
                ))}
              </div>
            </nav>
            <p className="font-gurmukhi border-t border-sand-deep/60 px-8 py-5 text-center text-sm text-gold-700">
              ਸਿਹਤਮੰਦ ਅਤੇ ਦਿਵਯਤਾ
            </p>
          </div>
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Instant search overlay                                              */
/* ------------------------------------------------------------------ */

const POPULAR = ["CR 500 Drops", "Triphala Juice", "Bamboo Brush", "Joint Solution Oil"];

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    try {
      const r = localStorage.getItem("hb_recent_searches");
      if (r) setRecent(JSON.parse(r));
    } catch {}
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setAll(d.products ?? []))
      .finally(() => setLoading(false));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const results = q
    ? all.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.categorySlug.replace(/-/g, " ").includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    : [];

  const remember = (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    localStorage.setItem("hb_recent_searches", JSON.stringify(next));
  };

  return (
    <div className="fixed inset-0 z-80" role="dialog" aria-modal="true" aria-label="Search products">
      <button type="button" aria-label="Close search" className="animate-fade-in absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-fade-up absolute inset-x-0 top-0 max-h-full overflow-y-auto bg-ivory pb-8 shadow-card-hover sm:inset-x-auto sm:left-1/2 sm:top-16 sm:max-h-[75vh] sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:rounded-3xl">
        <div className="sticky top-0 flex items-center gap-3 border-b border-sand-deep/60 bg-ivory px-5 py-4 sm:rounded-t-3xl">
          <Search size={19} className="shrink-0 text-gold-700" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories, SKU…"
            aria-label="Search"
            className="w-full bg-transparent text-[15px] text-charcoal outline-none placeholder:text-muted"
          />
          <button type="button" aria-label="Close search" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal hover:bg-botanical-50">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pt-4">
          {!q && (
            <>
              {recent.length > 0 && (
                <div className="mb-5">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Recent searches</p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button key={r} type="button" onClick={() => setQuery(r)} className="rounded-full border border-sand-deep bg-white px-3 py-1.5 text-xs font-semibold text-charcoal-soft hover:border-botanical-400 hover:text-botanical-800">
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Popular</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((r) => (
                  <button key={r} type="button" onClick={() => setQuery(r)} className="rounded-full border border-sand-deep bg-white px-3 py-1.5 text-xs font-semibold text-charcoal-soft hover:border-botanical-400 hover:text-botanical-800">
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}

          {q && loading && <p className="py-8 text-center text-sm text-muted">Searching…</p>}

          {q && !loading && results.length === 0 && (
            <div className="py-10 text-center">
              <p className="font-display text-lg text-botanical-900">No results for “{query}”</p>
              <p className="mt-1 text-sm text-muted">Try “drops”, “oil”, “bamboo” or browse the full shop.</p>
              <Link href="/products" onClick={onClose} className="mt-4 inline-block text-sm font-bold text-botanical-700 underline underline-offset-4">
                Browse all products
              </Link>
            </div>
          )}

          {q && results.length > 0 && (
            <ul className="divide-y divide-sand-deep/50">
              {results.slice(0, 8).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.slug}`}
                    onClick={() => {
                      remember(p.name);
                      onClose();
                    }}
                    className="flex items-center gap-4 py-3 transition-colors hover:bg-botanical-50/60"
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                      <Image src={p.image} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-charcoal">{p.name}</span>
                      <span className="block truncate text-xs text-muted">{p.shortDescription}</span>
                    </span>
                    <span className="text-sm font-bold text-botanical-900">{formatINR(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
