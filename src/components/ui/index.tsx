"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes } from "react";
import { Star, StarHalf, Minus, Plus, ChevronDown, X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { formatINR, discountPercent } from "@/lib/format";
import { useStore } from "@/components/providers/StoreProvider";

/* ---------------------------------------------------------------- */
/* Buttons                                                           */
/* ---------------------------------------------------------------- */

const btnBase =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed select-none";

const btnVariants = {
  primary:
    "bg-botanical-700 text-ivory hover:bg-botanical-800 active:scale-[0.98] shadow-sm hover:shadow-md",
  secondary:
    "bg-transparent text-botanical-800 border border-botanical-700/40 hover:border-botanical-700 hover:bg-botanical-50 active:scale-[0.98]",
  gold: "bg-gold-500 text-white hover:bg-gold-700 active:scale-[0.98] shadow-sm",
  ghost: "text-botanical-800 hover:bg-botanical-50",
  dark: "bg-charcoal text-ivory hover:bg-black active:scale-[0.98]",
} as const;

const btnSizes = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-6 py-3",
  lg: "text-[15px] px-8 py-3.5",
} as const;

type BtnProps = {
  variant?: keyof typeof btnVariants;
  size?: keyof typeof btnSizes;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: BtnProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ariaLabel,
}: BtnProps & { href: string; ariaLabel?: string }) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}

/* ---------------------------------------------------------------- */
/* Badges / labels                                                   */
/* ---------------------------------------------------------------- */

export function Badge({
  children,
  tone = "sage",
  className = "",
}: {
  children: ReactNode;
  tone?: "sage" | "gold" | "danger" | "dark" | "cream";
  className?: string;
}) {
  const tones = {
    sage: "bg-botanical-50 text-botanical-800 border border-botanical-200",
    gold: "bg-gold-500/10 text-gold-700 border border-gold-500/30",
    danger: "bg-danger/10 text-danger border border-danger/20",
    dark: "bg-charcoal text-ivory border border-charcoal",
    cream: "bg-cream text-charcoal-soft border border-sand-deep/60",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-gold-700 ${className}`}>
      {children}
    </p>
  );
}

/* ---------------------------------------------------------------- */
/* Rating stars                                                      */
/* ---------------------------------------------------------------- */

export function RatingStars({
  rating,
  reviewCount,
  size = 14,
  className = "",
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
  className?: string;
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.4;
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`} aria-label={`Rated ${rating} out of 5`}>
      <span className="inline-flex text-gold-500" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) =>
          i < full ? (
            <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
          ) : i === full && half ? (
            <span key={i} className="relative inline-flex">
              <Star size={size} className="text-sand-deep" fill="currentColor" strokeWidth={0} />
              <StarHalf size={size} fill="currentColor" strokeWidth={0} className="absolute inset-0" />
            </span>
          ) : (
            <Star key={i} size={size} className="text-sand-deep" fill="currentColor" strokeWidth={0} />
          )
        )}
      </span>
      <span className="text-xs font-semibold text-charcoal-soft">
        {rating.toFixed(1)}
        {typeof reviewCount === "number" && (
          <span className="font-normal text-muted"> ({reviewCount})</span>
        )}
      </span>
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Price                                                             */
/* ---------------------------------------------------------------- */

export function Price({
  price,
  compareAtPrice,
  size = "md",
  className = "",
}: {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: "text-base", md: "text-lg", lg: "text-2xl" };
  const off = discountPercent(price, compareAtPrice ?? null);
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`${sizes[size]} font-bold text-botanical-900`}>{formatINR(price)}</span>
      {compareAtPrice && compareAtPrice > price && (
        <>
          <span className="text-sm text-muted line-through">{formatINR(compareAtPrice)}</span>
          {off !== null && (
            <span className="text-xs font-bold text-success">{off}% off</span>
          )}
        </>
      )}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Quantity selector                                                 */
/* ---------------------------------------------------------------- */

export function QuantitySelector({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange: (v: number) => void;
  size?: "sm" | "md";
}) {
  const pad = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <span className="inline-flex items-center rounded-full border border-sand-deep bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        className={`${pad} inline-flex items-center justify-center rounded-full text-charcoal-soft hover:text-botanical-800 hover:bg-botanical-50 transition-colors`}
      >
        <Minus size={14} />
      </button>
      <span className="min-w-8 text-center text-sm font-bold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className={`${pad} inline-flex items-center justify-center rounded-full text-charcoal-soft hover:text-botanical-800 hover:bg-botanical-50 transition-colors`}
      >
        <Plus size={14} />
      </button>
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Accordion                                                         */
/* ---------------------------------------------------------------- */

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-sand-deep/60 rounded-2xl border border-sand-deep/60 bg-white/70">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-charcoal hover:text-botanical-800 transition-colors"
            >
              {item.q}
              <ChevronDown
                size={18}
                className={`shrink-0 text-gold-700 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-charcoal-soft">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Scroll reveal wrapper                                             */
/* ---------------------------------------------------------------- */

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------- */
/* Breadcrumbs                                                       */
/* ---------------------------------------------------------------- */

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-botanical-800 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-charcoal-soft" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------------------------------------------------------------- */
/* Section heading                                                   */
/* ---------------------------------------------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2 className="font-display text-3xl sm:text-4xl leading-tight text-botanical-900">{title}</h2>
      {description && <p className="mt-4 text-[15px] leading-relaxed text-charcoal-soft">{description}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Toasts                                                            */
/* ---------------------------------------------------------------- */

export function ToastViewport() {
  const { toasts, dismissToast } = useStore();
  if (toasts.length === 0) return null;
  const icons = {
    success: <CheckCircle2 size={18} className="text-success" />,
    error: <AlertCircle size={18} className="text-danger" />,
    info: <Info size={18} className="text-gold-700" />,
  };
  return (
    <div className="fixed bottom-24 left-1/2 z-90 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 sm:bottom-8 sm:left-auto sm:right-6 sm:translate-x-0" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-fade-up flex items-start gap-3 rounded-2xl border border-sand-deep/70 bg-white px-4 py-3 shadow-card-hover"
        >
          {icons[t.tone]}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-charcoal">{t.title}</p>
            {t.message && <p className="truncate text-xs text-muted">{t.message}</p>}
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(t.id)}
            className="text-muted hover:text-charcoal transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Empty state                                                       */
/* ---------------------------------------------------------------- */

export function EmptyState({
  icon,
  title,
  message,
  cta,
}: {
  icon: ReactNode;
  title: string;
  message?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-botanical-50 text-botanical-500">
        {icon}
      </div>
      <h2 className="font-display text-2xl text-botanical-900">{title}</h2>
      {message && <p className="mt-2 text-sm text-charcoal-soft">{message}</p>}
      {cta && (
        <ButtonLink href={cta.href} className="mt-8">
          {cta.label}
        </ButtonLink>
      )}
    </div>
  );
}
