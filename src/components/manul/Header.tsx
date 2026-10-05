import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { BrandMark } from "./BrandMark";
import { ReservationDialog } from "./ReservationDialog";

const navigationItems = [
  { key: "menu", id: "menu" },
  { key: "locations", id: "locations" },
  { key: "reviews", id: "reviews" },
  { key: "contacts", id: "contacts" },
] as const;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

type HeaderProps = {
  businessName?: string;
};

export function Header({
  businessName = "ManulCoffee",
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-coffee/95 shadow-header backdrop-blur-md"
          : "bg-coffee/35"
      }`}
    >
      <nav
        className="mx-auto grid h-20 max-w-site grid-cols-[minmax(0,1fr)_auto] items-center px-5 sm:px-8 lg:h-24"
        aria-label="Main navigation"
      >
        <a
          href="#top"
          onClick={() => setOpen(false)}
          aria-label={`${businessName} home`}
        >
          <BrandMark name={businessName} />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="nav-link"
            >
              {t.nav[item.key]}
            </a>
          ))}

          <div
            className="flex items-center rounded-full border border-primary-foreground/30 p-1 text-xs font-semibold text-primary-foreground"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full px-2.5 py-1.5 transition-colors ${
                language === "en"
                  ? "bg-primary-foreground text-coffee"
                  : "hover:bg-primary-foreground/10"
              }`}
              aria-pressed={language === "en"}
            >
              EN
            </button>

            <button
              type="button"
              onClick={() => setLanguage("lv")}
              className={`rounded-full px-2.5 py-1.5 transition-colors ${
                language === "lv"
                  ? "bg-primary-foreground text-coffee"
                  : "hover:bg-primary-foreground/10"
              }`}
              aria-pressed={language === "lv"}
            >
              LV
            </button>
          </div>

          <ReservationDialog
            trigger={
              <Button variant="light" size="lg">
                {t.nav.reserve}
              </Button>
            }
          />
        </div>

        <Button
          variant="nav"
          size="iconLg"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </nav>

      <div
        className={`overflow-hidden bg-coffee transition-[max-height,opacity] duration-300 md:hidden ${
          open ? "max-h-[34rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col border-t border-primary-foreground/15 px-5 py-4">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="border-b border-primary-foreground/10 py-4 text-lg text-primary-foreground"
              onClick={() => {
                setOpen(false);
                scrollTo(item.id);
              }}
            >
              {t.nav[item.key]}
            </a>
          ))}

          <div className="flex items-center gap-2 py-4 text-primary-foreground">
            <span className="mr-2 text-xs font-semibold uppercase tracking-label text-primary-foreground/60">
              Language
            </span>

            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                language === "en"
                  ? "border-primary-foreground bg-primary-foreground text-coffee"
                  : "border-primary-foreground/30"
              }`}
              aria-pressed={language === "en"}
            >
              EN
            </button>

            <button
              type="button"
              onClick={() => setLanguage("lv")}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                language === "lv"
                  ? "border-primary-foreground bg-primary-foreground text-coffee"
                  : "border-primary-foreground/30"
              }`}
              aria-pressed={language === "lv"}
            >
              LV
            </button>
          </div>

          <ReservationDialog
            trigger={
              <Button
                variant="light"
                size="xl"
                className="mt-2"
                onClick={() => setOpen(false)}
              >
                {t.nav.reserve}
              </Button>
            }
          />
        </div>
      </div>
    </header>
  );
}
