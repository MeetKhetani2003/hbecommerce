import type { MetadataRoute } from "next";
import { getAllProducts, getCategories, getServices } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/products",
    "/services",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/shipping-policy",
  ].map((p) => ({ url: `${SITE_URL}${p}`, lastModified: new Date() }));

  try {
    const [products, categories, services] = await Promise.all([
      getAllProducts(),
      getCategories(),
      getServices(),
    ]);
    return [
      ...staticRoutes,
      ...categories.map((c) => ({ url: `${SITE_URL}/products/${c.slug}`, lastModified: new Date() })),
      ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, lastModified: new Date() })),
      ...services.map((s) => ({ url: `${SITE_URL}/services/${s.slug}`, lastModified: new Date() })),
    ];
  } catch {
    return staticRoutes;
  }
}
