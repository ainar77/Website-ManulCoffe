import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "./BrandMark";
import { ReservationDialog } from "./ReservationDialog";

const links = ["Menu", "Locations", "Reviews", "Contacts"];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "bg-coffee/95 shadow-header backdrop-blur-md" : "bg-coffee/35"}`}>
      <nav className="mx-auto grid h-20 max-w-site grid-cols-[minmax(0,1fr)_auto] items-center px-5 sm:px-8 lg:h-24" aria-label="Main navigation">
        <a href="#top" onClick={() => setOpen(false)} aria-label="ManulCoffee home">
          <BrandMark />
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="nav-link">{link}</a>
          ))}
          <ReservationDialog trigger={<Button variant="light" size="lg">Reserve a Table</Button>} />
        </div>
        <Button variant="nav" size="iconLg" className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </Button>
      </nav>
      <div className={`overflow-hidden bg-coffee transition-[max-height,opacity] duration-300 md:hidden ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col border-t border-primary-foreground/15 px-5 py-4">
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="border-b border-primary-foreground/10 py-4 text-lg text-primary-foreground" onClick={() => { setOpen(false); scrollTo(link.toLowerCase()); }}>{link}</a>
          ))}
          <ReservationDialog trigger={<Button variant="light" size="xl" className="mt-4" onClick={() => setOpen(false)}>Reserve a Table</Button>} />
        </div>
      </div>
    </header>
  );
}