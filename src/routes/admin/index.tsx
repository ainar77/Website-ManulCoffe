import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { getSupabaseClient } from "@/integrations/supabase/client";
import type { Database } from "@/lib/supabase-types";
import { BrandMark } from "@/components/manul/BrandMark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const title = "ManulCoffee Admin";

type Reservation = Database["public"]["Tables"]["reservations"]["Row"];
type ReservationStatus = "pending" | "confirmed" | "cancelled";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: "ManulCoffee admin area." },
      { property: "og:title", content: title },
      { property: "og:description", content: "ManulCoffee admin area." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function formatDate(isoDate: string) {
  const [yearStr, monthStr, dayStr] = isoDate.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (!year || !month || !day) return isoDate;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time: string) {
  return time.length > 5 ? time.slice(0, 5) : time;
}

function sortReservations(rows: Reservation[]) {
  return [...rows].sort((a, b) => {
    const dateCompare = a.reservation_date.localeCompare(b.reservation_date);
    if (dateCompare !== 0) return dateCompare;
    return a.reservation_time.localeCompare(b.reservation_time);
  });
}

function isPending(status: string): status is "pending" {
  return status === "pending";
}

function statusLabel(status: string) {
  return status ? `${status.charAt(0).toUpperCase()}${status.slice(1)}` : status;
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-[var(--color-open)] text-primary-foreground border-transparent hover:bg-[var(--color-open)]/90";
    case "cancelled":
      return "bg-[var(--color-closed)] text-primary-foreground border-transparent hover:bg-[var(--color-closed)]/90";
    default:
      return "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] border-transparent hover:bg-[var(--color-accent)]/90";
  }
}

const VIEW_FILTERS = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

type ViewFilter = (typeof VIEW_FILTERS)[number]["value"];

function todayIso() {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const [view, setView] = useState<ViewFilter>("all");
  const [location, setLocation] = useState<string>("all");
  const [search, setSearch] = useState("");

  const sortedReservations = useMemo(
    () => sortReservations(reservations),
    [reservations]
  );

  const locations = useMemo(
    () =>
      Array.from(new Set(reservations.map((r) => r.location).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [reservations]
  );

  const visibleReservations = useMemo(() => {
    const today = todayIso();
    const query = search.trim().toLowerCase();

    return sortedReservations.filter((r) => {
      if (view === "today" && r.reservation_date !== today) return false;
      if (view === "upcoming" && (r.reservation_date < today || r.status === "cancelled"))
        return false;
      if (
        (view === "pending" || view === "confirmed" || view === "cancelled") &&
        r.status !== view
      )
        return false;

      if (location !== "all" && r.location !== location) return false;

      if (query) {
        const haystack = [r.customer_name, r.email, r.phone]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [sortedReservations, view, location, search]);

  const visiblePendingCount = visibleReservations.filter((r) => r.status === "pending").length;
  const visibleConfirmedCount = visibleReservations.filter((r) => r.status === "confirmed").length;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data: sessionData } = await getSupabaseClient().auth.getSession();
      if (cancelled) return;

      if (!sessionData.session) {
        navigate({ to: "/admin/login", replace: true });
        return;
      }

      setReady(true);
      setLoading(true);
      setError(null);
      setUpdateError(null);

      const { data, error: supabaseError } = await getSupabaseClient()
        .from("reservations")
        .select("*");

      if (cancelled) return;

      if (supabaseError || !data) {
        console.error("Failed to load reservations:", supabaseError);
        setError("We couldn't load the reservations. Please try again in a moment.");
        setReservations([]);
      } else {
        setReservations(sortReservations(data));
      }

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function handleSignOut() {
    await getSupabaseClient().auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  async function updateStatus(id: string, status: ReservationStatus) {
    setUpdatingId(id);
    setUpdateError(null);

    const { error: supabaseError } = await getSupabaseClient()
      .from("reservations")
      .update({ status })
      .eq("id", id);

    if (supabaseError) {
      console.error("Failed to update reservation status:", supabaseError);
      setUpdateError("We couldn't update the reservation status. Please try again.");
    } else {
      setReservations((prev) =>
        sortReservations(
          prev.map((reservation) =>
            reservation.id === id ? { ...reservation, status } : reservation
          )
        )
      );
    }

    setUpdatingId(null);
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
          <Button variant="dark" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:py-12">
        {!ready ? (
          <div className="flex min-h-[50svh] flex-col items-center justify-center gap-3 text-primary-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="text-sm">Checking your session…</p>
          </div>
        ) : (
          <>
            <div className="mb-6 sm:mb-8">
              <h1 className="font-display text-3xl font-semibold text-primary-foreground sm:text-4xl">
                Reservations
              </h1>
              <p className="mt-1 text-sm text-primary-foreground/70">
                Upcoming table reservations across both ManulCoffee locations.
              </p>
            </div>

            {updateError && (
              <div
                role="alert"
                className="mb-4 rounded-sm border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive-foreground"
              >
                {updateError}
              </div>
            )}

            <Card className="overflow-hidden border-0 shadow-header">
              <CardHeader className="border-b border-border/60 bg-muted/30">
                <CardTitle>All reservations</CardTitle>
                <CardDescription>
                  {loading
                    ? "Loading reservations…"
                    : `${sortedReservations.length} reservation${sortedReservations.length !== 1 ? "s" : ""} found`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex min-h-[16rem] items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading reservations…
                  </div>
                ) : error ? (
                  <div
                    role="alert"
                    className="flex min-h-[16rem] flex-col items-center justify-center gap-4 px-6 py-10 text-center"
                  >
                    <p className="max-w-md text-sm text-destructive">{error}</p>
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                      Try again
                    </Button>
                  </div>
                ) : sortedReservations.length === 0 ? (
                  <div className="flex min-h-[16rem] items-center justify-center px-6 py-10 text-center">
                    <p className="text-sm text-muted-foreground">No reservations yet.</p>
                  </div>
                ) : (
                  <>
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[120px]">Date</TableHead>
                            <TableHead className="w-[90px]">Time</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="w-[80px]">Guests</TableHead>
                            <TableHead className="w-[110px]">Status</TableHead>
                            <TableHead className="w-[200px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedReservations.map((reservation) => {
                            const isUpdating = updatingId === reservation.id;
                            return (
                              <TableRow key={reservation.id}>
                                <TableCell className="whitespace-nowrap font-medium">
                                  {formatDate(reservation.reservation_date)}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                  {formatTime(reservation.reservation_time)}
                                </TableCell>
                                <TableCell>{reservation.customer_name}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col gap-0.5 text-xs">
                                    <span className="text-foreground">{reservation.email}</span>
                                    <span className="text-muted-foreground">{reservation.phone}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{reservation.location}</TableCell>
                                <TableCell className="whitespace-nowrap">{reservation.guests}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className={`capitalize ${statusBadgeClass(reservation.status)}`}
                                  >
                                    {statusLabel(reservation.status)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {isPending(reservation.status) ? (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="default"
                                        size="sm"
                                        disabled={isUpdating}
                                        onClick={() => updateStatus(reservation.id, "confirmed")}
                                      >
                                        {isUpdating ? (
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : null}
                                        Confirm
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={isUpdating}
                                        onClick={() => updateStatus(reservation.id, "cancelled")}
                                      >
                                        {isUpdating ? (
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : null}
                                        Cancel
                                      </Button>
                                    </div>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="divide-y md:hidden">
                      {sortedReservations.map((reservation) => {
                        const isUpdating = updatingId === reservation.id;
                        return (
                          <div key={reservation.id} className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-display text-lg font-semibold text-foreground">
                                  {formatDate(reservation.reservation_date)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {formatTime(reservation.reservation_time)}
                                </p>
                              </div>
                              <Badge
                                variant="secondary"
                                className={`capitalize ${statusBadgeClass(reservation.status)}`}
                              >
                                {statusLabel(reservation.status)}
                              </Badge>
                            </div>
                            <dl className="mt-3 grid grid-cols-[5rem_1fr] gap-x-3 gap-y-2 text-sm">
                              <dt className="text-muted-foreground">Customer</dt>
                              <dd className="font-medium text-foreground">{reservation.customer_name}</dd>
                              <dt className="text-muted-foreground">Email</dt>
                              <dd className="break-all text-foreground">{reservation.email}</dd>
                              <dt className="text-muted-foreground">Phone</dt>
                              <dd className="text-foreground">{reservation.phone}</dd>
                              <dt className="text-muted-foreground">Location</dt>
                              <dd className="text-foreground">{reservation.location}</dd>
                              <dt className="text-muted-foreground">Guests</dt>
                              <dd className="text-foreground">{reservation.guests}</dd>
                            </dl>
                            {isPending(reservation.status) && (
                              <div className="mt-4 flex items-center gap-2">
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="flex-1"
                                  disabled={isUpdating}
                                  onClick={() => updateStatus(reservation.id, "confirmed")}
                                >
                                  {isUpdating ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : null}
                                  Confirm
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="flex-1"
                                  disabled={isUpdating}
                                  onClick={() => updateStatus(reservation.id, "cancelled")}
                                >
                                  {isUpdating ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : null}
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
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
