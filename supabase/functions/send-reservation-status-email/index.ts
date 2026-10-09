import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("Missing Edge Function environment configuration");
      return jsonResponse({ error: "Server configuration error" }, 500);
    }

    const authorization = req.headers.get("Authorization") ?? "";
    const match = /^Bearer\s+(.+)$/i.exec(authorization);
    if (!match) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    // Use the caller's JWT for both identity verification and RLS queries.
    // Never use a service-role key for this reservation lookup.
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser(match[1]);
    if (userError || !userData.user) {
      return jsonResponse({ error: "Invalid user session" }, 401);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }
    const payload = body as Record<string, unknown>;
    const reservationId = payload.reservationId;
    const status = payload.status;

    if (
      typeof reservationId !== "number" ||
      !Number.isSafeInteger(reservationId) ||
      reservationId <= 0 ||
      (status !== "confirmed" && status !== "cancelled")
    ) {
      return jsonResponse({ error: "Invalid reservation ID or status" }, 400);
    }

    // RLS permits SELECT on reservations only when private.is_admin() is true.
    // A non-admin cannot retrieve any reservation, even with a valid JWT.
    const { data: reservation, error: reservationError } = await supabase
      .from("reservations")
      .select("id, customer_name, email, location, reservation_date, reservation_time, guests, status")
      .eq("id", reservationId)
      .maybeSingle();

    if (reservationError) {
      console.error("Reservation lookup failed:", reservationError);
      return jsonResponse({ error: "Unable to verify reservation access" }, 500);
    }
    if (!reservation) {
      return jsonResponse({ error: "Reservation not found or access denied" }, 403);
    }
    if (reservation.status !== status) {
      return jsonResponse({ error: "Reservation status does not match database" }, 409);
    }

    const isConfirmed = status === "confirmed";
    const subject = isConfirmed
      ? "Your ManulCoffee reservation is confirmed"
      : "Your ManulCoffee reservation was cancelled";
    const heading = isConfirmed ? "Reservation confirmed" : "Reservation cancelled";
    const message = isConfirmed
      ? "Your table reservation has been confirmed. We look forward to seeing you."
      : "Your reservation has been cancelled. You can make a new reservation anytime on our website.";

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [reservation.email],
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>${heading}</h2>
            <p>Hello ${escapeHtml(reservation.customer_name)},</p>
            <p>${message}</p>
            <p>
              <strong>Location:</strong> ${escapeHtml(reservation.location)}<br>
              <strong>Date:</strong> ${escapeHtml(reservation.reservation_date)}<br>
              <strong>Time:</strong> ${escapeHtml(reservation.reservation_time)}<br>
              <strong>Guests:</strong> ${escapeHtml(reservation.guests)}<br>
              <strong>Status:</strong> ${isConfirmed ? "Confirmed" : "Cancelled"}
            </p>
            <p>ManulCoffee</p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      console.error("Reservation status email provider failed:", resendResponse.status);
      return jsonResponse({ error: "Email provider rejected the request" }, 502);
    }
    const resendData = await resendResponse.json();
    return jsonResponse({ success: true, emailId: resendData.id }, 200);
  } catch (error) {
    console.error("send-reservation-status-email failed:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});
