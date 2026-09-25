import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Pencil, Plus, X} from "lucide-react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import type { Database } from "@/lib/supabase-types";
import { BrandMark } from "@/components/manul/BrandMark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
const MENU_CATEGORIES = [
  "Hot",
  "Cold",
  "Breakfast",
  "Sweet Pastries",
  "Savoury Pastries",
] as const;

const MENU_TAGS = [
  "Popular",
  "New",
  "Vegan",
  "Vegetarian",
] as const;

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Hot",
  subcategory: "drinks",
  dietary_tags: [] as string[],
  sort_order: "0",
  is_available: true,
  is_featured: false,
};

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

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

function startEditing(item: MenuItem) {
  setForm({
    name: item.name,
    description: item.description ?? "",
    price: String(item.price),
    category: item.category,
    subcategory: item.subcategory ?? "",
    dietary_tags: item.dietary_tags ?? [],
    sort_order: String(item.sort_order),
    is_available: item.is_available,
    is_featured: item.is_featured,
  });

  setEditingItemId(item.id);
  setSaveError(null);
  setShowAddForm(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
  
function toggleTag(tag: string) {
  setForm((current) => ({
    ...current,
    dietary_tags: current.dietary_tags.includes(tag)
      ? current.dietary_tags.filter((item) => item !== tag)
      : [...current.dietary_tags, tag],
  }));
}

async function handleSaveItem(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  setSaveError(null);

  const name = form.name.trim();
  const description = form.description.trim();
  const price = Number(form.price);
  const sortOrder = Number(form.sort_order);

  if (!name) {
    setSaveError("Item name is required.");
    return;
  }

  if (
    form.price.trim() === "" ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    setSaveError("Enter a valid price.");
    return;
  }

  if (
    form.sort_order.trim() === "" ||
    !Number.isInteger(sortOrder) ||
    sortOrder < 0
  ) {
    setSaveError(
      "Sort order must be a whole number of 0 or greater."
    );
    return;
  }

  setSaving(true);

  const itemData = {
    name,
    description: description || null,
    price,
    category: form.category,
    subcategory: form.subcategory || null,
    dietary_tags: form.dietary_tags,
    sort_order: sortOrder,
    is_available: form.is_available,
    is_featured: form.is_featured,
  };

  if (editingItemId !== null) {
    const { data, error: supabaseError } =
      await getSupabaseClient()
        .from("menu_items")
        .update(itemData)
        .eq("id", editingItemId)
        .select()
        .single();

    if (supabaseError || !data) {
      console.error(
        "Failed to update menu item:",
        supabaseError
      );

      setSaveError(
        "We couldn't update the menu item. Please try again."
      );

      setSaving(false);
      return;
    }

    setMenuItems((current) =>
      current
        .map((item) =>
          item.id === editingItemId ? data : item
        )
        .sort((a, b) => {
          const categoryCompare =
            a.category.localeCompare(b.category);

          if (categoryCompare !== 0) {
            return categoryCompare;
          }

          return a.sort_order - b.sort_order;
        })
    );
  } else {
    const { data, error: supabaseError } =
      await getSupabaseClient()
        .from("menu_items")
        .insert(itemData)
        .select()
        .single();

    if (supabaseError || !data) {
      console.error(
        "Failed to create menu item:",
        supabaseError
      );

      setSaveError(
        "We couldn't add the menu item. Please try again."
      );

      setSaving(false);
      return;
    }

    setMenuItems((current) =>
      [...current, data].sort((a, b) => {
        const categoryCompare =
          a.category.localeCompare(b.category);

        if (categoryCompare !== 0) {
          return categoryCompare;
        }

        return a.sort_order - b.sort_order;
      })
    );
  }

  setForm(emptyForm);
  setEditingItemId(null);
  setShowAddForm(false);
  setSaving(false);
}
    
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
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
  <div>
    <h1 className="font-display text-3xl font-semibold text-primary-foreground sm:text-4xl">
      Menu
    </h1>

    <p className="mt-1 text-sm text-primary-foreground/70">
      Manage restaurant menu items and availability.
    </p>
  </div>

  <Button
    onClick={() => {
  if (showAddForm) {
    setShowAddForm(false);
    setEditingItemId(null);
    setForm(emptyForm);
    setSaveError(null);
    return;
  }

  setEditingItemId(null);
  setForm(emptyForm);
  setSaveError(null);
  setShowAddForm(true);
}}
  >
    {showAddForm ? (
      <X className="h-4 w-4" />
    ) : (
      <Plus className="h-4 w-4" />
    )}

    {showAddForm ? "Close" : "Add item"}
  </Button>
</div>

      {showAddForm && (
  <Card className="mb-6 border-0 shadow-header">
    <CardHeader>
      <CardTitle>
  {editingItemId !== null
    ? "Edit menu item"
    : "Add menu item"}
</CardTitle>

<CardDescription>
  {editingItemId !== null
    ? "Update this menu item."
    : "Create a new item for the restaurant menu."}
</CardDescription>
    </CardHeader>

    <CardContent>
      <form
        onSubmit={handleSaveItem}
        className="space-y-5"
      >
        {saveError && (
          <div
            role="alert"
            className="rounded-sm border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            {saveError}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="menu-name">
              Name
            </Label>

            <Input
              id="menu-name"
              value={form.name}
              disabled={saving}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="Cappuccino"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="menu-price">
              Price (€)
            </Label>

            <Input
              id="menu-price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              disabled={saving}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  price: event.target.value,
                }))
              }
              placeholder="4.20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="menu-description">
            Description
          </Label>

          <Input
            id="menu-description"
            value={form.description}
            disabled={saving}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Short description"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Category</Label>

            <Select
              value={form.category}
              disabled={saving}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  category: value,
                  subcategory:
                    value === "Hot" ||
                    value === "Cold"
                      ? "drinks"
                      : "food",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {MENU_CATEGORIES.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="menu-subcategory">
              Subcategory
            </Label>

            <Input
              id="menu-subcategory"
              value={form.subcategory}
              disabled={saving}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  subcategory: event.target.value,
                }))
              }
              placeholder="drinks"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="menu-order">
              Sort order
            </Label>

            <Input
              id="menu-order"
              type="number"
              min="0"
              step="1"
              value={form.sort_order}
              disabled={saving}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sort_order: event.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>

          <div className="flex flex-wrap gap-2">
            {MENU_TAGS.map((tag) => {
              const selected =
                form.dietary_tags.includes(tag);

              return (
                <Button
                  key={tag}
                  type="button"
                  size="sm"
                  disabled={saving}
                  variant={
                    selected
                      ? "default"
                      : "outline"
                  }
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_available}
              disabled={saving}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_available:
                    event.target.checked,
                }))
              }
            />

            Available
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              disabled={saving}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_featured:
                    event.target.checked,
                }))
              }
            />

            Featured
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => {
              setForm(emptyForm);
              setSaveError(null);
              setEditingItemId(null);
              setShowAddForm(false);
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={saving}
          >
            {saving && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {editingItemId !== null
            ? "Save changes"
            : "Add item"}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
)}
            
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
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
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
        €{Number(item.price).toFixed(2)}
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap gap-1">
          {item.dietary_tags?.length
            ? item.dietary_tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                >
                  {tag}
                </Badge>
              ))
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

      <TableCell className="text-right">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => startEditing(item)}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
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
                              <div className="mt-4">
  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() => startEditing(item)}
  >
    <Pencil className="h-4 w-4" />
    Edit
  </Button>
</div>
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
