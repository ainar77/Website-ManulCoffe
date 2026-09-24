import { useEffect, useState } from "react";
import menuCollection from "@/assets/menu-collection.jpg";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { SectionHeading } from "./SectionHeading";

const menuCategories = [
  "Hot",
  "Cold",
  "Breakfast",
  "Sweet Pastries",
  "Savoury Pastries",
] as const;

type MenuCategory = (typeof menuCategories)[number];

type MenuItem = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  dietary_tags: string[];
  sort_order: number;
};

const cropByCategory: Record<MenuCategory, string> = {
  Hot: "object-[25%_15%]",
  Cold: "object-[80%_15%]",
  Breakfast: "object-[12%_88%]",
  "Sweet Pastries": "object-[50%_88%]",
  "Savoury Pastries": "object-[88%_88%]",
};

export function MenuSection() {
  const [active, setActive] = useState<MenuCategory>("Hot");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } =
        await getSupabaseClient()
          .from("menu_items")
          .select(
            "id, name, description, price, category, dietary_tags, sort_order"
          )
          .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (supabaseError) {
        console.error("Failed to load menu:", supabaseError);
        setError("We couldn't load the menu right now.");
        setMenuItems([]);
      } else {
        setMenuItems((data ?? []) as MenuItem[]);
      }

      setLoading(false);
    }

    loadMenu();

    return () => {
      cancelled = true;
    };
  }, []);

  const visible = menuItems.filter(
    (item) => item.category === active
  );

  return (
    <section
      id="menu"
      className="scroll-mt-20 bg-background py-section"
    >
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            eyebrow="Made throughout the day"
            title="Menu"
          />

          <p className="mb-10 max-w-md text-muted-foreground sm:mb-14">
            Espresso-led classics, seasonal ideas and food made
            for unrushed mornings.
          </p>
        </div>

        <div
          className="no-scrollbar mb-10 flex gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Menu categories"
        >
          {menuCategories.map((category) => (
            <Button
              key={category}
              role="tab"
              aria-selected={active === category}
              variant={
                active === category
                  ? "filterActive"
                  : "filter"
              }
              onClick={() => setActive(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {loading && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Loading menu…
          </p>
        )}

        {error && !loading && (
          <p
            role="alert"
            className="py-12 text-center text-sm text-muted-foreground"
          >
            {error}
          </p>
        )}

        {!loading && !error && (
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-live="polite"
          >
            {visible.map((item, index) => {
              const tag = item.dietary_tags?.[0];

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden border-t border-border pt-4 animate-menu-in"
                >
                  <div className="mb-5 aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={menuCollection}
                      alt={`${item.name} at ManulCoffee`}
                      width={1600}
                      height={1200}
                      loading="lazy"
                      className={`h-full w-full object-cover ${cropByCategory[active]} transition-transform duration-700 group-hover:scale-[1.04]`}
                      style={{
                        animationDelay: `${index * 40}ms`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-semibold">
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      )}

                      {tag && (
                        <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-label text-accent">
                          {tag}
                        </span>
                      )}
                    </div>

                    <p className="shrink-0 font-semibold">
                      €{Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
