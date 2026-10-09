const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL");
const RESTAURANT_NOTIFICATION_EMAIL = Deno.env.get(
  "RESTAURANT_NOTIFICATION_EMAIL"
);

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

    if (!RESTAURANT_NOTIFICATION_EMAIL) {
      throw new Error("Missing RESTAURANT_NOTIFICATION_EMAIL");
    }

    const body = await req.json();

    const {
      customerName,
      email,
      phone,
      location,
      date,
      time,
      guests,
    } = body;

    if (
      !customerName ||
      !email ||
      !phone ||
      !location ||
      !date ||
      !time ||
      !guests
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

    const customerResponse = await fetch(
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
          subject: "We received your ManulCoffee reservation",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>ManulCoffee reservation received</h2>

              <p>Hello ${customerName},</p>

              <p>We received your reservation request.</p>

              <p>
                <strong>Location:</strong> ${location}<br>
                <strong>Date:</strong> ${date}<br>
                <strong>Time:</strong> ${time}<br>
                <strong>Guests:</strong> ${guests}<br>
                <strong>Status:</strong> Pending
              </p>

              <p>We’ll confirm your reservation shortly.</p>

              <p>ManulCoffee</p>
            </div>
          `,
        }),
      }
    );

    const customerData = await customerResponse.json();

    if (!customerResponse.ok) {
      console.error("Customer email failed:", customerData);

      return new Response(
        JSON.stringify({
          error: "Customer email failed",
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

    const coffeeShopResponse = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM_EMAIL,
          to: [RESTAURANT_NOTIFICATION_EMAIL],
          subject: `New reservation — ${date}, ${time}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>New ManulCoffee reservation</h2>

              <p>
                <strong>Customer:</strong> ${customerName}<br>
                <strong>Email:</strong> ${email}<br>
                <strong>Phone:</strong> ${phone}<br>
                <strong>Location:</strong> ${location}<br>
                <strong>Date:</strong> ${date}<br>
                <strong>Time:</strong> ${time}<br>
                <strong>Guests:</strong> ${guests}<br>
                <strong>Status:</strong> Pending
              </p>
            </div>
          `,
        }),
      }
    );

    const coffeeShopData = await coffeeShopResponse.json();

    if (!coffeeShopResponse.ok) {
      console.error("Coffee shop email failed:", coffeeShopData);

      return new Response(
        JSON.stringify({
          error: "Coffee shop email failed",
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
        customerEmailId: customerData.id,
        coffeeShopEmailId: coffeeShopData.id,
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
    console.error("send-reservation-email failed:", error);

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
