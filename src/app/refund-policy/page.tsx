import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Refund Policy", alternates: { canonical: "/refund-policy" } };

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      intro="Returns, refunds and the brand's stated guarantees."
      sections={[
        { heading: "101% Money Back Guarantee*", body: "CR 500 Drops carries the brand's stated 101% Money Back Guarantee*. The qualifying conditions and claim process are to be published here by the business. [CMS: business-approved terms required]" },
        { heading: "Returns", body: "[CMS: business-approved return window, eligible product conditions and process to be published here.]" },
        { heading: "Refunds", body: "[CMS: business-approved refund timelines and methods to be published here.]" },
        { heading: "How to raise a request", body: "Contact us on 75278-06146 / 77105-13989 or via WhatsApp with your order number." },
      ]}
    />
  );
}
