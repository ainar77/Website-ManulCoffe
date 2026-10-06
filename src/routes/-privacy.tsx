import { ArrowLeft } from "lucide-react";

import { BrandMark } from "@/components/manul/BrandMark";

type PrivacySection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

type PrivacyPageProps = {
  language: "en" | "lv";
  businessName: string;
  contactEmail?: string | null;
  eyebrow: string;
  title: string;
  updatedLabel: string;
  updatedDate: string;
  intro: string;
  demoNoticeTitle: string;
  demoNotice: string;
  sections: PrivacySection[];
  homeLabel: string;
  alternateLabel: string;
  alternateHref: string;
  rightsLabel: string;
};

export function PrivacyPage({
  language,
  businessName,
  contactEmail,
  eyebrow,
  title,
  updatedLabel,
  updatedDate,
  intro,
  demoNoticeTitle,
  demoNotice,
  sections,
  homeLabel,
  alternateLabel,
  alternateHref,
  rightsLabel,
}: PrivacyPageProps) {
  const homeHref = language === "lv" ? "/lv" : "/";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-coffee text-primary-foreground">
        <div className="mx-auto flex max-w-site items-center justify-between gap-6 px-5 py-5 sm:px-8">
          <a href={homeHref} aria-label={homeLabel}>
            <BrandMark name={businessName} />
          </a>

          <div className="flex items-center gap-4 text-sm">
            <a
              href={alternateHref}
              className="font-semibold underline-offset-4 hover:text-accent hover:underline"
            >
              {alternateLabel}
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
            <a
              href={homeHref}
              className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {homeLabel}
            </a>

            <p className="text-xs font-semibold uppercase tracking-label text-accent">
              {eyebrow}
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-none sm:text-6xl">
              {title}
            </h1>
            <p className="mt-5 text-sm text-muted-foreground">
              {updatedLabel}: {updatedDate}
            </p>
            <p className="mt-8 max-w-3xl text-base leading-8 text-muted-foreground">
              {intro}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="mb-12 rounded-lg border border-accent/30 bg-accent/10 p-6">
            <h2 className="font-display text-2xl font-semibold">
              {demoNoticeTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {demoNotice}
            </p>
          </div>

          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-3xl font-semibold">
                  {section.title}
                </h2>

                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 text-sm leading-7 text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.items && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {contactEmail && (
            <div className="mt-12 border-t border-border pt-8">
              <p className="text-sm text-muted-foreground">
                {language === "lv" ? "Privātuma jautājumiem:" : "Privacy contact:"}{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-semibold text-foreground underline underline-offset-4"
                >
                  {contactEmail}
                </a>
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-coffee py-8 text-primary-foreground">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 px-5 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {businessName}. {rightsLabel}
          </p>
          <a href={homeHref} className="hover:text-accent">
            {homeLabel}
          </a>
        </div>
      </footer>
    </div>
  );
}
