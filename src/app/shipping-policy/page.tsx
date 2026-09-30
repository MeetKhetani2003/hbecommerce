import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Shipping Policy", alternates: { canonical: "/shipping-policy" } };

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      intro="How and where we deliver your HB Lifecare orders."
      sections={[
        { heading: "Coverage", body: "We ship across India. [CMS: confirm serviceable regions and any international shipping.]" },
        { heading: "Charges", body: "Orders above ₹699 ship free; a flat ₹49 applies below that. [CMS-editable shipping configuration]" },
        { heading: "Timelines", body: "[CMS: business-approved dispatch and delivery timelines to be published here.]" },
        { heading: "Tracking", body: "Tracking details are shared after dispatch. [CMS: add courier partners once finalised.]" },
      ]}
    />
  );
}
