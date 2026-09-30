import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy-policy" } };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How HB Lifecare collects, uses and protects your personal information."
      sections={[
        { heading: "Information we collect", body: "Order details, contact details and account information you provide (name, email, phone, delivery address). [CMS: business-approved wording]" },
        { heading: "How we use it", body: "To process orders, respond to enquiries, arrange wellness sessions and improve our services. We do not sell personal data. [CMS: business-approved wording]" },
        { heading: "Payment information", body: "We never store raw card details. Online payment data is handled by the configured payment gateway once activated. [CMS: business-approved wording]" },
        { heading: "Contact", body: "For privacy questions, contact us via the details on the Contact page." },
      ]}
    />
  );
}
