import locationsImage from "@/assets/locations.jpg";
import { Clock, MapPin, Navigation } from "lucide-react";
import { locations } from "@/data/manulcoffee";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";

function isOpen() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Riga", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const day = parts.find((part) => part.type === "weekday")?.value;
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const weekend = day === "Sat" || day === "Sun";
  return weekend ? hour >= 9 && hour < 21 : hour >= 8 && hour < 20;
}

export function LocationsSection() {
  const open = isOpen();
  return (
    <section id="locations" className="scroll-mt-20 bg-coffee py-section text-primary-foreground">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionHeading eyebrow="Two rooms in Riga" title="Locations" light />
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          {locations.map((location, index) => (
            <article key={location.name}>
              <div className="aspect-[16/10] overflow-hidden bg-coffee-soft"><img src={locationsImage} alt={index === 0 ? "ManulCoffee Old Town cafe exterior" : "ManulCoffee Centre interior"} width={1600} height={1008} loading="lazy" className={`h-full w-full object-cover ${index === 0 ? "object-left" : "object-right"}`} /></div>
              <div className="grid gap-7 border-x border-b border-primary-foreground/15 p-6 sm:p-8">
                <div><div className="mb-3 flex items-center gap-2"><span className={`size-2 rounded-full ${open ? "bg-open" : "bg-closed"}`} /><span className="text-xs font-semibold uppercase tracking-label">{open ? "Open now" : "Closed"}</span></div><h3 className="font-display text-3xl font-semibold sm:text-4xl">{location.name}</h3><p className="mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/70">{location.description}</p></div>
                <div className="grid gap-3 text-sm"><p className="flex items-start gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-accent" />{location.address}</p><p className="flex items-start gap-3"><Clock className="mt-0.5 size-4 shrink-0 text-accent" /><span>Mon–Fri: {location.hours.weekday}<br />Sat–Sun: {location.hours.weekend}</span></p></div>
                <iframe title={`Map for ${location.name}`} src={location.mapUrl} loading="lazy" className="h-48 w-full border-0 grayscale contrast-75" referrerPolicy="no-referrer-when-downgrade" />
                <Button asChild variant="light" className="w-fit"><a href={location.directionsUrl} target="_blank" rel="noreferrer"><Navigation />Get directions</a></Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}