import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Facebook, Music2, Send, Mail, Phone, MapPin, ArrowDown } from "lucide-react";
import heroImage from "@/assets/manulcoffee-hero.jpg";
import seasonalImage from "@/assets/seasonal-selection.jpg";
import storyImage from "@/assets/craft-story.jpg";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/manul/BrandMark";
import { Header } from "@/components/manul/Header";
import { LocationsSection } from "@/components/manul/LocationsSection";
import { MenuSection } from "@/components/manul/MenuSection";
import { ReviewsSection } from "@/components/manul/ReviewsSection";
import { SectionHeading } from "@/components/manul/SectionHeading";
import { favorites, locations } from "@/data/manulcoffee";

const title = "ManulCoffee — Specialty Coffee in Riga";
const description = "ManulCoffee is a modern specialty coffee shop in Riga serving carefully crafted coffee, fresh pastries, and a relaxed city atmosphere.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: ManulCoffeePage,
});

function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }

function Hero() {
  return <section id="top" className="relative flex min-h-[88svh] items-end overflow-hidden bg-coffee text-primary-foreground">
    <img src={heroImage} alt="Barista preparing espresso in the warm ManulCoffee interior" width={1920} height={1200} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-hero-overlay" />
    <div className="relative mx-auto w-full max-w-site px-5 pb-12 pt-36 sm:px-8 sm:pb-16 lg:pb-20">
      <p className="mb-5 text-xs font-semibold uppercase tracking-label text-accent">Specialty coffee · Riga</p>
      <h1 className="max-w-5xl font-display text-6xl font-semibold leading-[0.88] sm:text-8xl lg:text-[8rem]">ManulCoffee</h1>
      <div className="mt-7 grid gap-8 border-t border-primary-foreground/30 pt-7 md:grid-cols-[1fr_auto] md:items-end">
        <div><p className="font-display text-2xl sm:text-3xl">Coffee worth slowing down for.</p><p className="mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/70">Carefully sourced beans, thoughtful food, and warm rooms made for the rhythm of Riga.</p></div>
        <div className="flex flex-wrap gap-3"><Button size="xl" variant="hero" onClick={() => scrollTo("menu")}>View menu</Button><Button size="xl" variant="heroOutline" onClick={() => scrollTo("locations")}>Find a location</Button></div>
      </div>
      <a href="#favorites" aria-label="Scroll to seasonal selection" className="absolute bottom-4 right-5 hidden size-11 place-items-center rounded-full border border-primary-foreground/30 transition-colors hover:bg-primary-foreground/10 sm:grid"><ArrowDown className="size-4" /></a>
    </div>
  </section>;
}

function Favorites() {
  return <section id="favorites" className="bg-surface py-section"><div className="mx-auto max-w-site px-5 sm:px-8"><SectionHeading eyebrow="For right now" title="Seasonal selection" /><div className="grid gap-6 md:grid-cols-3">{favorites.map((item, index) => <article key={item.name} className="group"><div className="aspect-[4/5] overflow-hidden bg-muted"><img src={seasonalImage} alt={item.name} width={1408} height={1008} loading="lazy" className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${index === 0 ? "object-left" : index === 1 ? "object-center" : "object-right"}`} /></div><div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-t border-coffee/20 pt-5"><div><p className="mb-2 text-xs font-semibold uppercase tracking-label text-accent">{item.tag}</p><h3 className="font-display text-2xl font-semibold">{item.name}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p></div><p className="font-semibold">{item.price}</p></div></article>)}</div></div></section>;
}

function Story() {
  return <section className="bg-background py-section"><div className="mx-auto grid max-w-site gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20"><div className="order-2 lg:order-1"><p className="mb-4 text-xs font-semibold uppercase tracking-label text-accent">Our approach</p><h2 className="font-display text-5xl font-semibold leading-none sm:text-6xl">Coffee, crafted with intention.</h2><p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground">ManulCoffee is a specialty coffee space built around quality, community, and considered details. Inspired by slow mornings and good conversations, we make each cup with care and keep our doors open to the rhythm of the city.</p><p className="mt-6 text-sm font-semibold">Sourced thoughtfully. Served warmly.</p></div><div className="order-1 aspect-[4/3] overflow-hidden bg-muted lg:order-2 lg:aspect-[4/5]"><img src={storyImage} alt="Barista carefully pouring latte art at ManulCoffee" width={1408} height={1008} loading="lazy" className="h-full w-full object-cover" /></div></div></section>;
}

const socials = [{ label: "Instagram", href: "https://instagram.com/", icon: Instagram }, { label: "Facebook", href: "https://facebook.com/", icon: Facebook }, { label: "TikTok", href: "https://tiktok.com/", icon: Music2 }, { label: "Telegram", href: "https://t.me/", icon: Send }];

function Contacts() {
  return <section id="contacts" className="scroll-mt-20 bg-accent py-section text-accent-foreground"><div className="mx-auto max-w-site px-5 sm:px-8"><SectionHeading eyebrow="Say hello" title="Contacts" /><div className="grid gap-10 border-t border-accent-foreground/25 pt-8 lg:grid-cols-2"><p className="max-w-xl font-display text-3xl leading-snug sm:text-4xl">Questions, collaborations, or just want to say hello? We’d love to hear from you.</p><div className="grid gap-5 text-sm sm:grid-cols-2"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locations[0].address)}`} target="_blank" rel="noreferrer" className="contact-link"><MapPin />{locations[0].address}</a><a href="tel:+37120001234" className="contact-link"><Phone />+371 20 001 234</a><a href="mailto:hello@manulcoffee.lv" className="contact-link"><Mail />hello@manulcoffee.lv</a><div className="flex gap-2">{socials.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full border border-accent-foreground/30 transition-colors hover:bg-accent-foreground hover:text-accent" aria-label={label}><Icon className="size-4" /></a>)}</div></div></div><p className="mt-12 text-xs text-accent-foreground/70">All contact details and social profiles shown are fictional demo content.</p></div></section>;
}

function Footer() {
  return <footer className="bg-coffee py-12 text-primary-foreground"><div className="mx-auto max-w-site px-5 sm:px-8"><div className="grid gap-10 border-b border-primary-foreground/15 pb-10 md:grid-cols-[1.2fr_0.8fr_1fr]"><div><BrandMark /><p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/60">Specialty coffee and thoughtful food, made for unhurried moments in Riga.</p></div><nav aria-label="Footer navigation" className="flex flex-col items-start gap-3 text-sm">{["Menu", "Locations", "Reviews", "Contacts"].map((link) => <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-accent">{link}</a>)}</nav><div className="space-y-5 text-sm text-primary-foreground/70">{locations.map((location) => <div key={location.name}><p className="font-semibold text-primary-foreground">{location.name.replace("ManulCoffee ", "")}</p><p className="mt-1">{location.address}</p><p>Mon–Fri {location.hours.weekday}</p></div>)}</div></div><div className="mt-8 flex flex-col gap-3 text-xs text-primary-foreground/50 sm:flex-row sm:justify-between"><p>© 2026 ManulCoffee. All rights reserved.</p><p>Fictional concept for portfolio presentation.</p></div></div></footer>;
}

function ManulCoffeePage() { return <><Header /><main><Hero /><Favorites /><MenuSection /><LocationsSection /><ReviewsSection /><Story /><Contacts /></main><Footer /></>; }