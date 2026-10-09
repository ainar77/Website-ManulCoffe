const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    if (!RESEND_FROM_EMAIL) {
      throw new Error("Missing RESEND_FROM_EMAIL");
    }

    const body = await req.json();

    const {
      customerName,
      email,
      location,
      date,
      time,
      guests,
      status,
    } = body;

    if (
      !customerName ||
      !email ||
      !location ||
      !date ||
      !time ||
      !guests ||
      !status
    ) {
      return new Response(
        JSON.stringify({
          error: "Missing required reservation data",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!["confirmed", "cancelled"].includes(status)) {
      return new Response(
        JSON.stringify({
          error: "Unsupported reservation status",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const isConfirmed = status === "confirmed";

    const subject = isConfirmed
      ? "Your ManulCoffee reservation is confirmed"
      : "Your ManulCoffee reservation was cancelled";

    const heading = isConfirmed
      ? "Reservation confirmed"
      : "Reservation cancelled";

    const message = isConfirmed
      ? "Your table reservation has been confirmed. We look forward to seeing you."
      : "Your reservation has been cancelled. You can make a new reservation anytime on our website.";

    const resendResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM_EMAIL,
          to: [email],
          subject,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>${heading}</h2>

              <p>Hello ${customerName},</p>

              <p>${message}</p>

              <p>
                <strong>Location:</strong> ${location}<br>
                <strong>Date:</strong> ${date}<br>
                <strong>Time:</strong> ${time}<br>
                <strong>Guests:</strong> ${guests}<br>
                <strong>Status:</strong> ${
                  isConfirmed ? "Confirmed" : "Cancelled"
                }
              </p>

              <p>ManulCoffee</p>
            </div>
          `,
        }),
      }
    );

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Reservation status email failed:", resendData);

      return new Response(
        JSON.stringify({
          error: "Email provider rejected the request",
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailId: resendData.id,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("send-reservation-status-email failed:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
