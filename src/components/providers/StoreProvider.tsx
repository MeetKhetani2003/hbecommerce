"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Product } from "@/lib/types";

type Toast = { id: number; title: string; message?: string; tone: "success" | "error" | "info" };

type StoreState = {
  cart: CartLine[];
  wishlist: number[];
  hydrated: boolean;
  cartOpen: boolean;
  lastAdded: CartLine | null;
  toasts: Toast[];
  addToCart: (p: Product, qty?: number, openDrawer?: boolean) => void;
  updateQuantity: (productId: number, qty: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  toggleWishlist: (p: Product) => void;
  isWishlisted: (productId: number) => boolean;
  setCartOpen: (open: boolean) => void;
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
  cartCount: number;
  cartSubtotal: number;
};

const StoreContext = createContext<StoreState | null>(null);

function toLine(p: Product, quantity: number): CartLine {
  return {
    productId: p.id,
    slug: p.slug,
    name: p.name,
    image: p.image,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    gstRate: String(p.gstRate),
    quantity,
    categorySlug: p.categorySlug,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartLine | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      const c = localStorage.getItem("hb_cart");
      const w = localStorage.getItem("hb_wishlist");
      if (c) setCart(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("hb_cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem("hb_wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addToCart = useCallback(
    (p: Product, qty = 1, openDrawer = true) => {
      setCart((prev) => {
        const existing = prev.find((l) => l.productId === p.id);
        if (existing) {
          return prev.map((l) =>
            l.productId === p.id ? { ...l, quantity: Math.min(l.quantity + qty, 10) } : l
          );
        }
        return [...prev, toLine(p, qty)];
      });
      setLastAdded(toLine(p, qty));
      if (openDrawer) setCartOpen(true);
      else pushToast({ title: "Added to cart", message: p.name, tone: "success" });
    },
    [pushToast]
  );

  const updateQuantity = useCallback((productId: number, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) => (l.productId === productId ? { ...l, quantity: Math.min(qty, 10) } : l))
    );
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (p: Product) => {
      setWishlist((prev) => {
        const has = prev.includes(p.id);
        pushToast({
          title: has ? "Removed from wishlist" : "Saved to wishlist",
          message: p.name,
          tone: "info",
        });
        return has ? prev.filter((id) => id !== p.id) : [...prev, p.id];
      });
    },
    [pushToast]
  );

  const isWishlisted = useCallback((id: number) => wishlist.includes(id), [wishlist]);

  const cartCount = useMemo(() => cart.reduce((s, l) => s + l.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((s, l) => s + l.price * l.quantity, 0), [cart]);

  const value: StoreState = {
    cart,
    wishlist,
    hydrated,
    cartOpen,
    lastAdded,
    toasts,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted,
    setCartOpen,
    pushToast,
    dismissToast,
    cartCount,
    cartSubtotal,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
