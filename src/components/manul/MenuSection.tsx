import { useState } from "react";
import menuCollection from "@/assets/menu-collection.jpg";
import { Button } from "@/components/ui/button";
import { menuCategories, menuItems, type MenuCategory } from "@/data/manulcoffee";
import { SectionHeading } from "./SectionHeading";

const cropByCategory: Record<MenuCategory, string> = {
  Hot: "object-[25%_15%]",
  Cold: "object-[80%_15%]",
  Breakfast: "object-[12%_88%]",
  "Sweet Pastries": "object-[50%_88%]",
  "Savoury Pastries": "object-[88%_88%]",
};

export function MenuSection() {
  const [active, setActive] = useState<MenuCategory>("Hot");
  const visible = menuItems.filter((item) => item.category === active);

  return (
    <section id="menu" className="scroll-mt-20 bg-background py-section">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading eyebrow="Made throughout the day" title="Menu" />
          <p className="mb-10 max-w-md text-muted-foreground sm:mb-14">Espresso-led classics, seasonal ideas and food made for unrushed mornings.</p>
        </div>
        <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Menu categories">
          {menuCategories.map((category) => <Button key={category} role="tab" aria-selected={active === category} variant={active === category ? "filterActive" : "filter"} onClick={() => setActive(category)}>{category}</Button>)}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {visible.map((item, index) => (
            <article key={item.name} className="group overflow-hidden border-t border-border pt-4 animate-menu-in">
              <div className="mb-5 aspect-[4/3] overflow-hidden bg-muted">
                <img src={menuCollection} alt={`${item.name} at ManulCoffee`} width={1600} height={1200} loading="lazy" className={`h-full w-full object-cover ${cropByCategory[active]} transition-transform duration-700 group-hover:scale-[1.04]`} style={{ animationDelay: `${index * 40}ms` }} />
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
                <div className="min-w-0"><h3 className="font-display text-2xl font-semibold">{item.name}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>{item.tag && <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-label text-accent">{item.tag}</span>}</div>
                <p className="shrink-0 font-semibold">{item.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}