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
      demoNotice="ManulCoffee is a fictional portfolio concept. This website demonstrates a reusable restaurant platform and must not be treated as a production privacy policy for a real restaurant without replacing the controller details, verifying hosting and international-transfer arrangements, and verifying that the configured retention controls are appropriate for the real operator."
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
            "The website is hosted and delivered through Cloudflare Pages. Cloudflare may process technical request and network data as part of providing, securing and operating the hosting service.",
            "The platform uses Supabase for database, authentication and server-side function infrastructure. Reservation data is stored in the Supabase-backed reservations database.",
            "The platform uses Resend to send transactional reservation emails. Data necessary for those messages, such as the guest's name, email address and reservation details, is transmitted through the email service. The initial restaurant notification can also contain the guest's telephone number.",
            "Authorised restaurant administrators can access reservation information through the protected administration interface where required to manage bookings.",
          ],
        },
        {
          title: "5. International processing",
          paragraphs: [
            "The exact processing locations, subprocessors and international-transfer arrangements depend on the Cloudflare, Supabase and Resend configuration used by the operator. These arrangements must be verified and documented before a real production deployment. Where personal data is transferred outside the European Economic Area, the controller must ensure that an applicable GDPR Chapter V transfer mechanism and safeguards are in place.",
          ],
        },
        {
          title: "6. Retention",
          paragraphs: [
            "Reservation records stored in the Supabase database are automatically deleted when the reservation date is more than 90 days in the past. A scheduled database cleanup runs daily to enforce this retention rule.",
            "The 90-day period is a platform retention setting, not a universal legal requirement. A real restaurant must verify that this period is appropriate for its purposes and legal obligations. Transactional emails already sent to the guest or restaurant may remain in the recipients' mailboxes, and Cloudflare, Supabase or Resend technical logs may be subject to separate retention periods. Those separate copies and retention periods must be reviewed before a real production deployment.",
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
            "The public website stores the selected EN/LV language preference in the browser's local storage. The administration area also uses browser storage required by Supabase authentication to maintain signed-in administrator sessions.",
            "The current public website does not use non-essential advertising or behavioural analytics technologies identified by the project's privacy audit. Embedded Google Maps and externally hosted Google Fonts are not loaded automatically. A directions link may open Google Maps only after the visitor chooses to follow that external link, after which the external service's own privacy practices apply.",
            "If non-essential analytics, advertising or other tracking technologies are added later, their use must be assessed before activation and, where consent is legally required, they must not run before valid consent is obtained.",
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
