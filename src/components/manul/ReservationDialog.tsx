import { useCallback, useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";

interface FormState {
  customerName: string;
  email: string;
  phone: string;
  location: string;
  date: string;
  time: string;
  guests: string;
}

const emptyForm: FormState = {
  customerName: "",
  email: "",
  phone: "",
  location: "",
  date: "",
  time: "",
  guests: "",
};

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const phoneDigitsPattern = /^\d{8}$/;

const reservationTimes = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function sanitizePhoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 8);
}

function sanitizeGuestValue(value: string): string {
  return value.replace(/\D/g, "");
}

export function ReservationDialog({
  trigger,
}: {
  trigger: ReactNode;
}) {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<FormState>(emptyForm);

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null
  );

  const [locationOptions, setLocationOptions] = useState<
    { name: string; name_lv: string | null }[]
  >([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locationsError, setLocationsError] = useState<string | null>(null);

  // Load active restaurant locations from Supabase
  // whenever the reservation dialog is opened.
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadLocations() {
      setLocationsLoading(true);
      setLocationsError(null);

      try {
        const { data, error } = await getSupabaseClient()
          .from("business_locations")
          .select("name, name_lv")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error(
            "Failed to load reservation locations:",
            error
          );

          setLocationOptions([]);
          setLocationsError(
            t.reservation.locationsError
          );

          return;
        }

        const options = data ?? [];
        const canonicalNames = options.map(
          (location) => location.name
        );

        setLocationOptions(options);

        // Keep the canonical English name as the stored reservation value.
        // Only the visible label is localized.
        setForm((current) => ({
          ...current,
          location: canonicalNames.includes(current.location)
            ? current.location
            : "",
        }));
      } catch (unexpected) {
        if (cancelled) return;

        console.error(
          "Failed to load reservation locations:",
          unexpected
        );

        setLocationOptions([]);
        setLocationsError(
          t.reservation.locationsError
        );
      } finally {
        if (!cancelled) {
          setLocationsLoading(false);
        }
      }
    }

    void loadLocations();

    return () => {
      cancelled = true;
    };
  }, [open, t.reservation.locationsError]);

  const update = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSubmitError(null);
  };

  const loadAvailability = useCallback(
    async (location: string, date: string) => {
      if (!location || !date) {
        setUnavailableTimes([]);
        setAvailabilityError(null);
        return;
      }

      setAvailabilityLoading(true);
      setAvailabilityError(null);

      try {
        const { data, error } = await getSupabaseClient().rpc(
          "get_unavailable_reservation_times",
          {
            p_location: location,
            p_date: date,
          }
        );

        if (error) {
          console.error(
            "Availability check failed:",
            error
          );

          setUnavailableTimes([]);

          setAvailabilityError(
            t.reservation.availabilityError
          );

          return;
        }

        const times = (data ?? []).map((row) =>
          String(row.reservation_time).slice(0, 5)
        );

        setUnavailableTimes(times);
      } catch (unexpected) {
        console.error(
          "Availability check failed:",
          unexpected
        );

        setUnavailableTimes([]);

        setAvailabilityError(
          t.reservation.availabilityError
        );
      } finally {
        setAvailabilityLoading(false);
      }
    },
    [t.reservation.availabilityError]
  );

  // Re-check available times whenever location or date changes.
  useEffect(() => {
    setForm((current) => ({
      ...current,
      time: "",
    }));

    if (!form.location || !form.date) {
      setUnavailableTimes([]);
      setAvailabilityError(null);
      return;
    }

    void loadAvailability(
      form.location,
      form.date
    );
  }, [
    form.location,
    form.date,
    loadAvailability,
  ]);

  const updatePhone = (raw: string) => {
    update(
      "phone",
      sanitizePhoneDigits(raw)
    );
  };

  const updateGuests = (raw: string) => {
    update(
      "guests",
      sanitizeGuestValue(raw)
    );
  };

  const validate = (): boolean => {
    const next: Partial<
      Record<keyof FormState, string>
    > = {};

    if (!form.customerName.trim()) {
      next.customerName =
        t.reservation.nameRequired;
    }

    if (!form.email.trim()) {
      next.email =
        t.reservation.emailRequired;
    } else if (
      !emailPattern.test(form.email.trim())
    ) {
      next.email =
        t.reservation.emailInvalid;
    }

    if (!form.phone) {
      next.phone =
        t.reservation.phoneRequired;
    } else if (
      !phoneDigitsPattern.test(form.phone)
    ) {
      next.phone =
        t.reservation.phoneInvalid;
    }

    if (!form.location) {
      next.location =
        t.reservation.locationRequired;
    }

    if (!form.date) {
      next.date =
        t.reservation.dateRequired;
    } else if (
      form.date < todayString()
    ) {
      next.date =
        t.reservation.datePast;
    }

    if (!form.time) {
      next.time =
        t.reservation.timeRequired;
    } else if (
      unavailableTimes.includes(form.time)
    ) {
      next.time =
        t.reservation.timeUnavailable;
    }

    const guests = Number(form.guests);

    if (!form.guests) {
      next.guests =
        t.reservation.guestsRequired;
    } else if (
      Number.isNaN(guests) ||
      !Number.isInteger(guests) ||
      guests < 1 ||
      guests > 8
    ) {
      next.guests =
        t.reservation.guestsInvalid;
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitError(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      const { error } = await getSupabaseClient()
        .from("reservations")
        .insert({
          customer_name:
            form.customerName.trim(),
          email:
            form.email
              .trim()
              .toLowerCase(),
          phone: `+371${form.phone}`,
          location: form.location,
          reservation_date: form.date,
          reservation_time: form.time,
          guests: Number(form.guests),
        });

      if (error) {
        console.error(
          "Reservation insert failed:",
          error
        );

        // Unique active reservation slot conflict.
        if (error.code === "23505") {
          setSubmitError(
            t.reservation.slotTaken
          );

          setForm((current) => ({
            ...current,
            time: "",
          }));

          await loadAvailability(
            form.location,
            form.date
          );

          return;
        }

        setSubmitError(
          t.reservation.saveError
        );

        return;
      }

      // Reservation was saved successfully.
      // Email failure must not remove the reservation.
      try {
        const { error: emailError } =
          await getSupabaseClient().functions.invoke(
            "send-reservation-email",
            {
              body: {
                customerName:
                  form.customerName.trim(),
                email:
                  form.email
                    .trim()
                    .toLowerCase(),
                phone: `+371${form.phone}`,
                location: form.location,
                date: form.date,
                time: form.time,
                guests: Number(form.guests),
              },
            }
          );

        if (emailError) {
          console.error(
            "Reservation email failed:",
            emailError
          );
        }
      } catch (emailUnexpected) {
        console.error(
          "Reservation email failed:",
          emailUnexpected
        );
      }

      setForm(emptyForm);
      setErrors({});
      setUnavailableTimes([]);
      setAvailabilityError(null);
      setSuccess(true);
    } catch (unexpected) {
      console.error(
        "Reservation insert failed:",
        unexpected
      );

      setSubmitError(
        t.reservation.saveError
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (
    next: boolean
  ) => {
    setOpen(next);

    if (!next) {
      setErrors({});
      setSubmitError(null);
      setSuccess(false);
      setAvailabilityError(null);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogContent className="max-h-[92svh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg p-6 sm:p-8">
        {success ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle2
              className="size-12 text-accent"
              aria-hidden="true"
            />

            <DialogHeader className="items-center text-center">
              <DialogTitle className="font-display text-2xl">
                {t.reservation.receivedTitle}
              </DialogTitle>

              <DialogDescription className="max-w-xs">
                {t.reservation.receivedDescription}
              </DialogDescription>
            </DialogHeader>

            <Button
              variant="dark"
              size="lg"
              onClick={() =>
                handleOpenChange(false)
              }
            >
              {t.reservation.done}
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-3xl">
                {t.reservation.title}
              </DialogTitle>

              <DialogDescription>
                {t.reservation.description}
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-2 grid gap-4"
            >
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="reservation-name">
                  {t.reservation.name}
                </Label>

                <Input
                  id="reservation-name"
                  autoComplete="name"
                  placeholder={t.reservation.fullNamePlaceholder}
                  value={form.customerName}
                  onChange={(event) =>
                    update(
                      "customerName",
                      event.target.value
                    )
                  }
                  aria-invalid={Boolean(
                    errors.customerName
                  )}
                />

                {errors.customerName && (
                  <p className="text-sm text-destructive">
                    {errors.customerName}
                  </p>
                )}
              </div>

              {/* Email + Phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="reservation-email">
                    {t.reservation.email}
                  </Label>

                  <Input
                    id="reservation-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(event) =>
                      update(
                        "email",
                        event.target.value
                      )
                    }
                    aria-invalid={Boolean(
                      errors.email
                    )}
                  />

                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="reservation-phone">
                    {t.reservation.phone}
                  </Label>

                  <div className="flex overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <span className="flex items-center border-r border-input bg-muted px-3 text-sm text-muted-foreground select-none">
                      +371
                    </span>

                    <Input
                      id="reservation-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="29123456"
                      value={form.phone}
                      onChange={(event) =>
                        updatePhone(
                          event.target.value
                        )
                      }
                      onPaste={(event) => {
                        event.preventDefault();

                        const text =
                          event.clipboardData?.getData(
                            "text"
                          ) ?? "";

                        updatePhone(text);
                      }}
                      aria-invalid={Boolean(
                        errors.phone
                      )}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>

                  {errors.phone && (
                    <p className="text-sm text-destructive">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="grid gap-2">
                <Label htmlFor="reservation-location">
                  {t.reservation.location}
                </Label>

                <Select
                  value={form.location}
                  onValueChange={(value) =>
                    update("location", value)
                  }
                  disabled={
                    locationsLoading ||
                    Boolean(locationsError)
                  }
                >
                  <SelectTrigger
                    id="reservation-location"
                    aria-invalid={Boolean(
                      errors.location
                    )}
                  >
                    <SelectValue
                      placeholder={
                        locationsLoading
                          ? t.reservation.loadingLocations
                          : t.reservation.chooseCafe
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {locationOptions.map(
                      (location) => {
                        const displayName =
                          language === "lv"
                            ? location.name_lv?.trim() || location.name
                            : location.name;

                        return (
                          <SelectItem
                            key={location.name}
                            value={location.name}
                          >
                            {displayName}
                          </SelectItem>
                        );
                      }
                    )}
                  </SelectContent>
                </Select>

                {locationsError && (
                  <p className="text-sm text-destructive">
                    {locationsError}
                  </p>
                )}

                {!locationsLoading &&
                  !locationsError &&
                  locationOptions.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      {t.reservation.noLocations}
                    </p>
                  )}

                {errors.location && (
                  <p className="text-sm text-destructive">
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Date + Time + Guests */}
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Date */}
                <div className="grid gap-2">
                  <Label htmlFor="reservation-date">
                    {t.reservation.date}
                  </Label>

                  <Input
                    id="reservation-date"
                    type="date"
                    min={todayString()}
                    value={form.date}
                    onChange={(event) =>
                      update(
                        "date",
                        event.target.value
                      )
                    }
                    aria-invalid={Boolean(
                      errors.date
                    )}
                  />

                  {errors.date && (
                    <p className="text-sm text-destructive">
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Time */}
                <div className="grid gap-2">
                  <Label htmlFor="reservation-time">
                    {t.reservation.time}
                  </Label>

                  <Select
                    value={form.time}
                    onValueChange={(value) =>
                      update("time", value)
                    }
                    disabled={
                      !form.location ||
                      !form.date ||
                      availabilityLoading ||
                      Boolean(
                        availabilityError
                      )
                    }
                  >
                    <SelectTrigger
                      id="reservation-time"
                      aria-invalid={Boolean(
                        errors.time
                      )}
                    >
                      <SelectValue
                        placeholder={
                          availabilityLoading
                            ? t.reservation.checkingTimes
                            : t.reservation.chooseTime
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {reservationTimes.map(
                        (time) => {
                          const unavailable =
                            unavailableTimes.includes(
                              time
                            );

                          return (
                            <SelectItem
                              key={time}
                              value={time}
                              disabled={
                                unavailable
                              }
                            >
                              {unavailable
                                ? `${time} — ${t.reservation.booked}`
                                : time}
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>

                  {availabilityLoading && (
                    <p className="text-sm text-muted-foreground">
                      {t.reservation.checkingAvailableTimes}
                    </p>
                  )}

                  {availabilityError && (
                    <p className="text-sm text-destructive">
                      {availabilityError}
                    </p>
                  )}

                  {!availabilityLoading &&
                    !availabilityError &&
                    form.location &&
                    form.date &&
                    unavailableTimes.length ===
                      reservationTimes.length && (
                      <p className="text-sm text-destructive">
                        {t.reservation.noTimes}
                      </p>
                    )}

                  {errors.time && (
                    <p className="text-sm text-destructive">
                      {errors.time}
                    </p>
                  )}
                </div>

                {/* Guests */}
                <div className="grid gap-2">
                  <Label htmlFor="reservation-guests">
                    {t.reservation.guests}
                  </Label>

                  <Input
                    id="reservation-guests"
                    type="number"
                    min={1}
                    max={8}
                    step={1}
                    inputMode="numeric"
                    value={form.guests}
                    onChange={(event) =>
                      updateGuests(
                        event.target.value
                      )
                    }
                    aria-invalid={Boolean(
                      errors.guests
                    )}
                  />

                  {errors.guests && (
                    <p className="text-sm text-destructive">
                      {errors.guests}
                    </p>
                  )}
                </div>
              </div>

              {submitError && (
                <p
                  role="alert"
                  className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {submitError}
                </p>
              )}

              <p className="text-xs leading-relaxed text-muted-foreground">
                {t.reservation.privacyNotice}{" "}
                <a
                  href={language === "lv" ? "/lv/privacy" : "/privacy"}
                  className="font-medium underline underline-offset-4 hover:text-foreground"
                >
                  {t.reservation.privacyPolicy}
                </a>
              </p>

              <Button
                type="submit"
                variant="dark"
                size="xl"
                disabled={submitting}
                className="mt-1 w-full"
              >
                {submitting && (
                  <Loader2
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}

                {submitting
                  ? t.reservation.sending
                  : t.reservation.confirm}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
