"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { formatINR, FREE_SHIPPING_THRESHOLD } from "@/lib/format";
import { QuantitySelector, ButtonLink } from "@/components/ui";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart, cartSubtotal, lastAdded } =
    useStore();

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  const remainingForFree = FREE_SHIPPING_THRESHOLD - cartSubtotal;

  return (
    <div className="fixed inset-0 z-80" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        aria-label="Close cart"
        className="animate-fade-in absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />
      <aside className="animate-drawer-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory shadow-drawer">
        <div className="flex items-center justify-between border-b border-sand-deep/60 px-5 py-4">
          <h2 className="font-display text-xl text-botanical-900">Your Cart</h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal hover:bg-botanical-50"
          >
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-botanical-50 text-botanical-500">
              <ShoppingBag size={26} />
            </span>
            <p className="font-display text-xl text-botanical-900">Your cart is waiting for something natural.</p>
            <ButtonLink href="/products" className="mt-6" size="md">
              Explore Products
            </ButtonLink>
          </div>
        ) : (
          <>
            {lastAdded && (
              <p className="border-b border-botanical-100 bg-botanical-50 px-5 py-2.5 text-xs font-semibold text-botanical-800">
                ✓ Added to cart — {lastAdded.name}
              </p>
            )}
            {remainingForFree > 0 ? (
              <p className="border-b border-sand-deep/50 bg-cream px-5 py-2.5 text-xs text-charcoal-soft">
                Add <strong className="text-botanical-800">{formatINR(remainingForFree)}</strong> more for free shipping.
              </p>
            ) : (
              <p className="border-b border-sand-deep/50 bg-cream px-5 py-2.5 text-xs font-semibold text-success">
                🎉 You’ve unlocked free shipping.
              </p>
            )}

            <ul className="hb-scroll flex-1 divide-y divide-sand-deep/50 overflow-y-auto px-5">
              {cart.map((line) => (
                <li key={line.productId} className="flex gap-4 py-4">
                  <Link
                    href={`/products/${line.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream"
                  >
                    <Image src={line.image} alt={line.name} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-charcoal">{line.name}</p>
                    <p className="mt-0.5 text-sm font-bold text-botanical-900">{formatINR(line.price)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <QuantitySelector
                        size="sm"
                        value={line.quantity}
                        onChange={(v) => updateQuantity(line.productId, v)}
                      />
                      <button
                        type="button"
                        aria-label={`Remove ${line.name} from cart`}
                        onClick={() => removeFromCart(line.productId)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-sand-deep/60 bg-white/60 px-5 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-charcoal-soft">Subtotal</span>
                <span className="text-lg font-extrabold text-botanical-900">{formatINR(cartSubtotal)}</span>
              </div>
              <p className="mb-4 text-[11px] text-muted">GST included. Shipping calculated at checkout.</p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="inline-flex items-center justify-center rounded-full border border-botanical-700/40 px-5 py-3 text-sm font-bold text-botanical-800 transition-colors hover:border-botanical-700 hover:bg-botanical-50"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="inline-flex items-center justify-center rounded-full bg-botanical-700 px-5 py-3 text-sm font-bold text-ivory transition-colors hover:bg-botanical-800"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
