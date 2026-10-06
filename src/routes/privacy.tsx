import { createFileRoute } from "@tanstack/react-router";

import { getPublicBusinessSeoData } from "@/lib/publicBusinessSeo.functions";
import { PrivacyPage } from "./-privacy";

const siteUrl = "https://website-manulcoffe.pages.dev";
const title = "Privacy Policy — ManulCoffee";
const description =
  "Learn how the ManulCoffee demo website processes reservation and website data.";

export const Route = createFileRoute("/privacy")({
  loader: async () => getPublicBusinessSeoData(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${siteUrl}/privacy` },
      { property: "og:site_name", content: "ManulCoffee" },
      { property: "og:locale", content: "en_US" },
    ],
    links: [
      { rel: "canonical", href: `${siteUrl}/privacy` },
      { rel: "alternate", hrefLang: "en", href: `${siteUrl}/privacy` },
      { rel: "alternate", hrefLang: "lv", href: `${siteUrl}/lv/privacy` },
      { rel: "alternate", hrefLang: "x-default", href: `${siteUrl}/privacy` },
    ],
  }),
  component: EnglishPrivacyRoute,
});

function EnglishPrivacyRoute() {
  const data = Route.useLoaderData();
  const businessName = data?.settings?.business_name?.trim() || "ManulCoffee";
  const contactEmail = data?.settings?.contact_email?.trim() || null;

  return (
    <PrivacyPage
      language="en"
      businessName={businessName}
      contactEmail={contactEmail}
      eyebrow="Privacy & personal data"
      title="Privacy Policy"
      updatedLabel="Last updated"
      updatedDate="6 October 2026"
      intro="This policy explains what personal data is processed when you use the ManulCoffee website and submit a table reservation, why it is processed, which service providers are involved, and what rights you have."
      demoNoticeTitle="Portfolio demo notice"
      demoNotice="ManulCoffee is a fictional portfolio concept. This website demonstrates a reusable restaurant platform and must not be treated as a production privacy policy for a real restaurant without replacing the controller details, verifying hosting and international-transfer arrangements, and implementing the retention controls described below."
      homeLabel="Back to ManulCoffee"
      alternateLabel="LV"
      alternateHref="/lv/privacy"
      rightsLabel="All rights reserved."
      sections={[
        {
          title: "1. Data controller",
          paragraphs: [
            `For this portfolio demo, the website is presented under the name ${businessName}. A real deployment must identify the actual legal person or organisation acting as the data controller, including its legal name and appropriate contact details.`,
            contactEmail
              ? `Questions about privacy for this demo can be sent to ${contactEmail}.`
              : "A privacy contact email must be configured before real production use.",
          ],
        },
        {
          title: "2. Personal data we process",
          paragraphs: [
            "When you submit a table reservation, the system processes the information required to create and manage that reservation.",
          ],
          items: [
            "name;",
            "email address;",
            "telephone number;",
            "selected restaurant location;",
            "reservation date and time;",
            "number of guests;",
            "reservation status;",
            "technical record information such as the reservation identifier and creation time.",
          ],
        },
        {
          title: "3. Purposes and legal basis",
          paragraphs: [
            "Reservation data is processed to receive the booking request, check and manage the reservation, contact the guest about it, and send transactional reservation messages.",
            "For a real restaurant deployment, this processing is intended to rely primarily on Article 6(1)(b) GDPR: processing necessary to take steps at the guest's request and to provide the requested reservation service. Consent is not used as the legal basis for ordinary reservation administration.",
          ],
        },
        {
          title: "4. Service providers and recipients",
          paragraphs: [
            "The platform uses Supabase for database, authentication and server-side function infrastructure. Reservation data is stored in the Supabase-backed reservations database.",
            "The platform uses Resend to send transactional reservation emails. Data necessary for those messages, such as the guest's name, email address and reservation details, is transmitted through the email service. The initial restaurant notification can also contain the guest's telephone number.",
            "Authorised restaurant administrators can access reservation information through the protected administration interface where required to manage bookings.",
          ],
        },
        {
          title: "5. International processing",
          paragraphs: [
            "The exact hosting region, subprocessors and international-transfer arrangements depend on the Supabase and Resend configuration used by the operator. These settings must be verified and documented before a real production deployment. Where personal data is transferred outside the European Economic Area, the controller must ensure that an applicable GDPR Chapter V transfer mechanism and safeguards are in place.",
          ],
        },
        {
          title: "6. Retention",
          paragraphs: [
            "The current demo does not yet perform automatic deletion of old reservation records. Records remain stored until they are manually deleted by an administrator. This is a known pre-production limitation.",
            "Before this platform is used for real customer reservations, the operator must define a justified retention period and implement deletion or anonymisation so reservation data is not kept longer than necessary. This will be addressed in the retention stage of this project.",
          ],
        },
        {
          title: "7. Your data protection rights",
          paragraphs: [
            "Subject to the conditions and exceptions in the GDPR, you may have rights to request access to your personal data, correction of inaccurate data, deletion, restriction of processing, data portability, and to object where processing is based on an applicable legitimate interest. You also have the right to lodge a complaint with the competent supervisory authority, including the Latvian Data State Inspectorate where applicable.",
          ],
        },
        {
          title: "8. Cookies and browser storage",
          paragraphs: [
            "The public website stores the selected EN/LV language preference in the browser's local storage. The administration area also uses Supabase authentication session storage for signed-in administrators.",
            "A separate cookie and third-party technology audit is still part of this project's GDPR phase. Any non-essential analytics or tracking technology added later must be assessed before it is activated and, where required, must not run before valid consent is obtained.",
          ],
        },
        {
          title: "9. Automated decision-making",
          paragraphs: [
            "The reservation workflow does not use automated decision-making or profiling that produces legal or similarly significant effects on guests.",
          ],
        },
        {
          title: "10. Changes to this policy",
          paragraphs: [
            "This policy may be updated when the platform's data processing, service providers, retention rules or legal requirements change. The date at the top of this page indicates the current version.",
          ],
        },
      ]}
    />
  );
}
