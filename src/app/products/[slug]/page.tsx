import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getProductBySlug,
  getCategoryBySlug,
  getProductsByCategory,
  getRelatedProducts,
  getCategories,
  getFaqs,
} from "@/lib/data";
import { ProductDetail } from "@/components/product/ProductDetail";
import { CatalogView } from "@/components/product/CatalogView";
import { ProductGrid } from "@/components/product/ProductCard";
import { Breadcrumbs, SectionHeading, Reveal, ButtonLink, Accordion, Eyebrow } from "@/components/ui";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (category) {
    return {
      title: `${category.name} — ${category.tagline}`,
      description: category.description,
      alternates: { canonical: `/products/${category.slug}` },
      openGraph: { images: [category.image] },
    };
  }
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — ${product.shortDescription}`,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { images: [product.image], type: "website" },
  };
}

export default async function ProductOrCategoryPage({ params }: Props) {
  const { slug } = await params;

  /* ---------------- Category page ---------------- */
  const category = await getCategoryBySlug(slug);
  if (category) {
    const [products, categories, faqs] = await Promise.all([
      getProductsByCategory(slug),
      getCategories(),
      getFaqs(),
    ]);
    const related = categories.filter((c) => c.slug !== slug);
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/products" }, { label: category.name }]}
        />
        <div className="mt-6 grid items-center gap-8 overflow-hidden rounded-3xl bg-botanical-900 lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <Eyebrow className="!text-gold-300">{category.tagline}</Eyebrow>
            <h1 className="font-display mt-3 text-4xl text-ivory sm:text-5xl">{category.name}</h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ivory/80">{category.description}</p>
          </div>
          <div className="relative hidden aspect-[4/3] lg:block">
            <Image src={category.image} alt={category.name} fill sizes="50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-botanical-900 to-transparent" />
          </div>
        </div>

        <div className="mt-10">
          <CatalogView products={products} categories={categories} lockedCategory={slug} />
        </div>

        {/* Related categories */}
        <section className="mt-20">
          <SectionHeading eyebrow="Keep Exploring" title="Related Categories" align="left" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {related.map((c) => (
              <a
                key={c.slug}
                href={`/products/${c.slug}`}
                className="group flex items-center gap-5 rounded-3xl border border-sand-deep/60 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                  <Image src={c.image} alt="" fill sizes="80px" className="object-cover" />
                </span>
                <span className="flex-1">
                  <span className="font-display block text-lg text-botanical-900">{c.name}</span>
                  <span className="mt-0.5 block text-xs text-muted">{c.tagline}</span>
                </span>
                <ArrowRight size={18} className="text-gold-700 transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-20 max-w-3xl">
          <SectionHeading eyebrow="Good to Know" title="Frequently Asked Questions" />
          <div className="mt-8">
            <Accordion items={faqs.slice(0, 4).map((f) => ({ q: f.question, a: f.answer }))} />
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/contact" variant="secondary">
              Still have questions? Contact us
            </ButtonLink>
          </div>
        </section>
      </div>
    );
  }

  /* ---------------- Product detail page ---------------- */
  const product = await getProductBySlug(slug);
  if (!product || !product.isActive) notFound();

  const related = await getRelatedProducts(product, 4);
  const productCategory = await getCategoryBySlug(product.categorySlug);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    image: `${SITE_URL}${product.image}`,
    description: product.shortDescription,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(product.rating),
            reviewCount: product.reviewCount,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/products` },
      {
        "@type": "ListItem",
        position: 3,
        name: productCategory?.name ?? product.categorySlug,
        item: `${SITE_URL}/products/${product.categorySlug}`,
      },
      { "@type": "ListItem", position: 4, name: product.name },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 pb-28 sm:px-6 lg:px-8 lg:pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productJsonLd, breadcrumbJsonLd]) }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/products" },
          { label: productCategory?.name ?? "Products", href: `/products/${product.categorySlug}` },
          { label: product.name },
        ]}
      />
      <div className="mt-8">
        <ProductDetail product={product} />
      </div>

      {/* Related products */}
      <section className="mt-20" aria-label="Related products">
        <Reveal>
          <SectionHeading eyebrow="Keep Exploring" title="You May Also Like" align="left" />
        </Reveal>
        <Reveal className="mt-8">
          <ProductGrid products={related} />
        </Reveal>
      </section>
    </div>
  );
}
