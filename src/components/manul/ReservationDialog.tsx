import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSupabaseClient } from "@/integrations/supabase/client";
import { locations } from "@/data/manulcoffee";

interface FormState {
  customerName: string;
  email: string;
  phone: string;
  location: string;
  date: string;
  time: string;
  guests: string;
}

const emptyForm: FormState = { customerName: "", email: "", phone: "", location: "", date: "", time: "", guests: "2" };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ReservationDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.customerName.trim()) next.customerName = "Please enter your name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!emailPattern.test(form.email.trim())) next.email = "Please enter a valid email address.";
    if (!form.phone.trim()) next.phone = "Please enter your phone number.";
    if (!form.location) next.location = "Please choose a location.";
    if (!form.date) next.date = "Please choose a date.";
    else if (form.date < todayString()) next.date = "Please choose a date that is not in the past.";
    if (!form.time) next.time = "Please choose a time.";
    const guests = Number(form.guests);
    if (!form.guests || Number.isNaN(guests) || guests < 1) next.guests = "At least 1 guest is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { error } = await getSupabaseClient()
        .from("reservations")
        .insert({
          customer_name: form.customerName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          location: form.location,
          reservation_date: form.date,
          reservation_time: form.time,
          guests: Number(form.guests),
        });

      if (error) {
        console.error("Reservation insert failed:", error);
        setSubmitError("We couldn't save your reservation just now. Please try again in a moment.");
        return;
      }

      setForm(emptyForm);
      setErrors({});
      setSuccess(true);
    } catch (unexpected) {
      console.error("Reservation insert failed:", unexpected);
      setSubmitError("We couldn't save your reservation just now. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setErrors({});
      setSubmitError(null);
      setSuccess(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92svh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg p-6 sm:p-8">
        {success ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle2 className="size-12 text-accent" aria-hidden="true" />
            <DialogHeader className="items-center text-center">
              <DialogTitle className="font-display text-2xl">Reservation received</DialogTitle>
              <DialogDescription className="max-w-xs">
                Thank you, your table request has been sent. We'll confirm your reservation by email shortly.
              </DialogDescription>
            </DialogHeader>
            <Button variant="dark" size="lg" onClick={() => handleOpenChange(false)}>Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-3xl">Reserve a table</DialogTitle>
              <DialogDescription>Tell us when you'd like to visit and we'll set a table aside for you.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} noValidate className="mt-2 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="reservation-name">Name</Label>
                <Input id="reservation-name" autoComplete="name" placeholder="Your full name" value={form.customerName} onChange={(event) => update("customerName", event.target.value)} aria-invalid={Boolean(errors.customerName)} />
                {errors.customerName && <p className="text-sm text-destructive">{errors.customerName}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="reservation-email">Email</Label>
                  <Input id="reservation-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reservation-phone">Phone</Label>
                  <Input id="reservation-phone" type="tel" autoComplete="tel" placeholder="+371 ..." value={form.phone} onChange={(event) => update("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reservation-location">Location</Label>
                <Select value={form.location} onValueChange={(value) => update("location", value)}>
                  <SelectTrigger id="reservation-location" aria-invalid={Boolean(errors.location)}>
                    <SelectValue placeholder="Choose a café" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.name} value={location.name}>{location.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="reservation-date">Date</Label>
                  <Input id="reservation-date" type="date" min={todayString()} value={form.date} onChange={(event) => update("date", event.target.value)} aria-invalid={Boolean(errors.date)} />
                  {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reservation-time">Time</Label>
                  <Input id="reservation-time" type="time" value={form.time} onChange={(event) => update("time", event.target.value)} aria-invalid={Boolean(errors.time)} />
                  {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reservation-guests">Guests</Label>
                  <Input id="reservation-guests" type="number" min={1} max={20} inputMode="numeric" value={form.guests} onChange={(event) => update("guests", event.target.value)} aria-invalid={Boolean(errors.guests)} />
                  {errors.guests && <p className="text-sm text-destructive">{errors.guests}</p>}
                </div>
              </div>
              {submitError && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{submitError}</p>}
              <Button type="submit" variant="dark" size="xl" disabled={submitting} className="mt-1 w-full">
                {submitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                {submitting ? "Sending your reservation…" : "Confirm reservation"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
