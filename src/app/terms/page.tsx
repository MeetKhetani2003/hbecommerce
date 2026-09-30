import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { BRAND } from "@/lib/types";

export const metadata: Metadata = { title: "Terms of Service", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="The terms that govern your use of the HB Lifecare website and purchases made through it."
      sections={[
        { heading: "Use of this website", body: "By using this website you agree to these terms. Content is provided for general informational and wellness purposes. [CMS: business-approved wording]" },
        { heading: "Products & wellness information", body: BRAND.disclaimer },
        { heading: "Orders & pricing", body: "All prices are in INR and inclusive of GST unless stated otherwise. Prices and stock are validated on our servers at the time of ordering. [CMS: business-approved wording]" },
        { heading: "Wellness services", body: "Wellness sessions reflect the organisation's stated holistic framework and are complementary to — not a substitute for — professional medical care. [CMS: business-approved wording]" },
      ]}
    />
  );
}
