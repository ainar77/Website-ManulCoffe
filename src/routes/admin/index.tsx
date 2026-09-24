import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import type { Database } from "@/lib/supabase-types";
import { BrandMark } from "@/components/manul/BrandMark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const title = "Menu — ManulCoffee Admin";

type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];

export const Route = createFileRoute("/admin/menu")({
  head: () => ({
    meta: [
      { title },
      {
        name: "description",
        content: "Manage ManulCoffee menu.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminMenuPage,
});

function AdminMenuPage() {
  const navigate = useNavigate();

  const [ready, setReady] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      const { data: sessionData } =
        await getSupabaseClient().auth.getSession();

      if (cancelled) return;

      if (!sessionData.session) {
        navigate({
          to: "/admin/login",
          replace: true,
        });

        return;
      }

      setReady(true);
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } =
        await getSupabaseClient()
          .from("menu_items")
          .select("*")
          .order("category", { ascending: true })
          .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (supabaseError || !data) {
        console.error(
          "Failed to load admin menu:",
          supabaseError
        );

        setError(
          "We couldn't load the menu. Please try again."
        );

        setMenuItems([]);
      } else {
        setMenuItems(data);
      }

      setLoading(false);
    }

    loadMenu();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const availableCount = useMemo(
    () =>
      menuItems.filter((item) => item.is_available).length,
    [menuItems]
  );

  const hiddenCount = menuItems.length - availableCount;

  return (
    <div className="min-h-svh bg-coffee">
      <header className="border-b border-primary-foreground/10 bg-coffee/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <BrandMark compact />

            <span className="font-display text-lg font-semibold text-primary-foreground">
              ManulCoffee Admin
            </span>
          </div>

          <Button
            variant="dark"
            size="sm"
            onClick={() =>
              navigate({ to: "/admin" })
            }
          >
            <ArrowLeft className="h-4 w-4" />
            Reservations
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:py-12">
        {!ready ? (
          <div className="flex min-h-[50svh] flex-col items-center justify-center gap-3 text-primary-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />

            <p className="text-sm">
              Checking your session…
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 sm:mb-8">
              <h1 className="font-display text-3xl font-semibold text-primary-foreground sm:text-4xl">
                Menu
              </h1>

              <p className="mt-1 text-sm text-primary-foreground/70">
                Manage restaurant menu items and availability.
              </p>
            </div>

            {!loading && !error && (
              <div className="mb-6 flex flex-wrap gap-3 text-sm">
                <div className="rounded-sm border border-primary-foreground/10 bg-primary-foreground/5 px-4 py-3 text-primary-foreground">
                  Total:{" "}
                  <strong>{menuItems.length}</strong>
                </div>

                <div className="rounded-sm border border-primary-foreground/10 bg-primary-foreground/5 px-4 py-3 text-primary-foreground">
                  Available:{" "}
                  <strong>{availableCount}</strong>
                </div>

                <div className="rounded-sm border border-primary-foreground/10 bg-primary-foreground/5 px-4 py-3 text-primary-foreground">
                  Hidden:{" "}
                  <strong>{hiddenCount}</strong>
                </div>
              </div>
            )}

            <Card className="overflow-hidden border-0 shadow-header">
              <CardHeader className="border-b border-border/60 bg-muted/30">
                <CardTitle>Menu items</CardTitle>

                <CardDescription>
                  {loading
                    ? "Loading menu…"
                    : `${menuItems.length} items`}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                {loading ? (
                  <div className="flex min-h-[16rem] items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading menu…
                  </div>
                ) : error ? (
                  <div
                    role="alert"
                    className="flex min-h-[16rem] items-center justify-center px-6 py-10 text-center"
                  >
                    <p className="text-sm text-destructive">
                      {error}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Desktop */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {menuItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">
                                    {item.name}
                                  </p>

                                  {item.description && (
                                    <p className="mt-0.5 max-w-md text-xs text-muted-foreground">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </TableCell>

                              <TableCell>
                                {item.category}
                              </TableCell>

                              <TableCell className="whitespace-nowrap font-medium">
                                €
                                {Number(
                                  item.price
                                ).toFixed(2)}
                              </TableCell>

                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {item.dietary_tags?.length
                                    ? item.dietary_tags.map(
                                        (tag) => (
                                          <Badge
                                            key={tag}
                                            variant="secondary"
                                          >
                                            {tag}
                                          </Badge>
                                        )
                                      )
                                    : "—"}
                                </div>
                              </TableCell>

                              <TableCell>
                                {item.sort_order}
                              </TableCell>

                              <TableCell>
                                <Badge
                                  variant={
                                    item.is_available
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {item.is_available
                                    ? "Available"
                                    : "Hidden"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile */}
                    <div className="divide-y md:hidden">
                      {menuItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h2 className="font-display text-lg font-semibold">
                                {item.name}
                              </h2>

                              <p className="text-sm text-muted-foreground">
                                {item.category}
                              </p>
                            </div>

                            <Badge
                              variant={
                                item.is_available
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {item.is_available
                                ? "Available"
                                : "Hidden"}
                            </Badge>
                          </div>

                          {item.description && (
                            <p className="mt-3 text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          )}

                          <div className="mt-3 flex items-center justify-between">
                            <span className="font-semibold">
                              €
                              {Number(
                                item.price
                              ).toFixed(2)}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              Order: {item.sort_order}
                            </span>
                          </div>

                          {item.dietary_tags?.length >
                            0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {item.dietary_tags.map(
                                (tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                  >
                                    {tag}
                                  </Badge>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
