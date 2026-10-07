# Restaurant Website Platform — Production Deployment

This document describes the production configuration required when deploying
the platform for a real restaurant.

The demo project currently runs as ManulCoffee. Production configuration should
be changed through environment variables and server-side secrets instead of
hardcoding restaurant-specific values in the application.

---

## 1. Production Domain

The public website URL is configured with:

```env
VITE_PUBLIC_SITE_URL=https://example.com

For Cloudflare Pages, configure this variable in the production build
environment.
Do not include a trailing slash.
Example:
VITE_PUBLIC_SITE_URL=https://coffeehouse.lv

After changing the variable, create a new production deployment.
The build process automatically generates:
- public/robots.txt
- public/sitemap.xml
The application also uses the configured URL for:
- canonical URLs
- hreflang URLs
- Open Graph URLs
- structured SEO data
- English and Latvian public pages
Do not store passwords, API keys, or other secrets in variables prefixed with
VITE_, because Vite variables can be included in client-side code.
2. Cloudflare Custom Domain
For a real restaurant:
1. Add the restaurant's custom domain to the Cloudflare Pages project.
2. Configure the required DNS records.
3. Set VITE_PUBLIC_SITE_URL to the final production domain.
4. Redeploy the application.
5. Verify that the custom domain serves the production website.
After the custom domain is active, review whether the default pages.dev
domain should redirect to the primary custom domain.
3. Production Email
Transactional reservation emails are sent by Supabase Edge Functions through
Resend.
The required server-side configuration is:
RESEND_API_KEY
RESEND_FROM_EMAIL
RESTAURANT_NOTIFICATION_EMAIL

These values must be configured as server-side Supabase Edge Function secrets
or environment configuration.
Never expose RESEND_API_KEY in frontend code or commit it to GitHub.
RESEND_API_KEY
API key used by the Edge Functions to communicate with Resend.
Example:
RESEND_API_KEY=<secret>

RESEND_FROM_EMAIL
Sender displayed to customers.
Demo configuration may use the Resend testing sender.
Production example:
RESEND_FROM_EMAIL=Coffee House <reservations@coffeehouse.lv>

The production sender domain must be configured and verified in Resend before
it is used for live customer email.
RESTAURANT_NOTIFICATION_EMAIL
Destination for new reservation notifications.
Example:
RESTAURANT_NOTIFICATION_EMAIL=reservations@coffeehouse.lv

This address can be changed without modifying the Edge Function source code.
4. Resend Domain Verification
Before using a restaurant domain as the sender:
1. Add the sending domain to Resend.
2. Copy the DNS records provided by Resend.
3. Add the required records to the domain's DNS configuration.
4. Wait for DNS propagation.
5. Verify the domain in Resend.
6. Change RESEND_FROM_EMAIL to an address using the verified domain.
7. Redeploy the relevant Supabase Edge Functions if required by the deployment
   workflow.
8. Send test reservation and status emails.
The exact DNS values must always be copied from the Resend dashboard. Do not
invent or reuse DNS values from another domain.
SPF
SPF helps authorize the email infrastructure that is allowed to send mail for
the configured domain.
DKIM
DKIM provides a cryptographic signature that receiving mail servers can use to
verify authenticated email.
DMARC
DMARC provides an additional domain-level email authentication policy and
reporting mechanism.
A production domain should review an appropriate DMARC policy as part of its
email security configuration.
5. Supabase Configuration
Before production launch, verify the Supabase project configuration.
Review:
- production database
- Row Level Security policies
- administrator accounts
- Edge Function secrets
- authentication settings
- allowed application URLs / redirect URLs
- reservation retention job
- production email configuration
The frontend must use only the public/publishable Supabase credentials intended
for browser use.
Never expose the Supabase service_role key in frontend code.
6. Reservation Email Test
After production email configuration is complete, perform an end-to-end test.
Test the following flow:
1. Create a reservation from the public website.
2. Confirm that the reservation appears in the Admin dashboard.
3. Confirm that the customer receives the reservation email.
4. Confirm that the restaurant receives the new reservation notification.
5. Change the reservation status to Confirmed.
6. Confirm that the customer receives the status email.
7. Change a test reservation to Cancelled and verify the cancellation email.
Check the sender, recipient, restaurant name, location, date, time and guest
count in the generated emails.
7. SEO Verification
After connecting the production domain, verify:
https://example.com/robots.txt
https://example.com/sitemap.xml

The files must contain the final production domain.
Also inspect the server-rendered page source for:
- canonical URL
- hreflang="en"
- hreflang="lv"
- hreflang="x-default"
- Open Graph URL
- JSON-LD structured data
Verify both:
/

and:
/lv

The Privacy Policy URLs must also use the production domain:
/privacy
/lv/privacy

8. Privacy and Data Processing
The current platform processes reservation information required to manage a
booking.
Production deployment must review the Privacy Policy and replace demo-specific
business information where necessary.
Infrastructure and processors used by the current architecture include:
- Cloudflare Pages
- Supabase
- Resend
The reservation database currently uses an automated retention process that
removes old reservation rows after the configured retention period.
Email copies and infrastructure/provider logs can have separate retention
periods and must be considered separately.
If analytics, advertising, tracking pixels or other non-essential tracking
technologies are added later, the privacy and consent implementation must be
reviewed before they are enabled.
9. Security Review
Before a real public launch, complete the platform security-hardening phase.
This includes reviewing:
- Edge Function CORS configuration
- server-side request validation
- HTML escaping for user-provided reservation data
- abuse and spam protection
- authentication and authorization
- Edge Function access rules
- production origin allowlists
- secret management
- version-controlled Edge Function source code
The current demo configuration must not be treated as the final security
configuration for a real restaurant deployment.
10. Production Launch Checklist
Before declaring a restaurant deployment production-ready, confirm:
- custom domain is active
- HTTPS works correctly
- VITE_PUBLIC_SITE_URL contains the production domain
- robots.txt contains the production domain
- sitemap.xml contains the production domain
- canonical and hreflang URLs are correct
- Resend sending domain is verified
- production sender email is configured
- restaurant notification email is configured
- reservation emails work
- Confirmed status email works
- Cancelled status email works
- Supabase authentication configuration is reviewed
- administrator access works
- Privacy Policy contains the correct business information
- reservation retention is active
- security-hardening review is complete
Demo Status
The ManulCoffee deployment is a demonstration environment.
It currently uses the Cloudflare Pages demo domain and a Resend testing sender.
A real custom domain and verified production email domain must be configured
before this platform is used as a production website for a real restaurant.
