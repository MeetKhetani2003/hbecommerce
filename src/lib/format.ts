export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function discountPercent(price: number, compareAt: number | null): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/* GST-inclusive pricing model (standard for Indian D2C retail).
   Tax component is derived from the inclusive price per line item.
   Punjab deliveries → CGST + SGST split; other states → IGST. */
export function gstComponentOf(inclusivePrice: number, gstRate: number): number {
  return inclusivePrice - inclusivePrice / (1 + gstRate / 100);
}

export const FREE_SHIPPING_THRESHOLD = 699;
export const FLAT_SHIPPING = 49;
export const HOME_STATE = "punjab";

export function computeTotals(
  lines: { price: number; quantity: number; gstRate: string | number }[],
  state?: string
) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const gstRaw = lines.reduce(
    (s, l) => s + gstComponentOf(l.price * l.quantity, Number(l.gstRate) || 12),
    0
  );
  const gst = Math.round(gstRaw);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;
  const intra = (state ?? "").trim().toLowerCase() === HOME_STATE;
  const gstBreakdown = intra
    ? { cgst: Math.round(gstRaw / 2), sgst: gst - Math.round(gstRaw / 2), igst: 0 }
    : { cgst: 0, sgst: 0, igst: gst };
  return { subtotal, gst, gstBreakdown, shipping, total, discount: 0 };
}
