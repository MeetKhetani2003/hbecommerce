import type { Metadata } from "next";
import { getAllProducts, getCategories } from "@/lib/data";
import { CatalogView } from "@/components/product/CatalogView";
import { Breadcrumbs, Eyebrow } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Herbal Wellness",
  description:
    "Browse HB Lifecare's full catalog of herbal supplements, natural topical care and eco-friendly bamboo hygiene products.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <div className="mt-6 max-w-2xl">
        <Eyebrow>The HB Lifecare Collection</Eyebrow>
        <h1 className="font-display mt-3 text-4xl text-botanical-900 sm:text-5xl">Shop Herbal Wellness</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-charcoal-soft">
          Herbal supplements, natural personal care and sustainable bamboo hygiene — thoughtfully
          developed under practitioner guidance.
        </p>
      </div>
      <div className="mt-10">
        <CatalogView products={products} categories={categories} />
      </div>
    </div>
  );
}
