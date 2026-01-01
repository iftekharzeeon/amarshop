import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("SSLCommerz Success Callback received", {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  });

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response("Server configuration error", {
        status: 500,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const formData = await req.formData();
    const transactionId = formData.get("tran_id") as string;
    const status = formData.get("status") as string;
    const amount = formData.get("amount") as string;
    const currency = formData.get("currency") as string;
    const bankTransactionId = formData.get("bank_tran_id") as string;

    console.log("Payment success callback:", {
      transactionId,
      status,
      amount,
      currency,
      bankTransactionId,
    });

    if (status === "VALID") {
      // Update order status to completed
      await supabase
        .from("orders")
        .update({
          status: "completed",
          transaction_id: bankTransactionId,
        })
        .eq("id", transactionId);

      // Redirect to success page
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${
            Deno.env.get("FRONTEND_URL_AMARSHOP") || "http://localhost:8080"
          }/payment-success?payment=success&order=${transactionId}`,
        },
      });
    } else {
      // Payment validation failed
      await supabase
        .from("orders")
        .update({ status: "failed" })
        .eq("id", transactionId);

      return new Response(null, {
        status: 302,
        headers: {
          Location: `${
            Deno.env.get("FRONTEND_URL_AMARSHOP") || "http://localhost:8080"
          }/payment-success?payment=failed&order=${transactionId}`,
        },
      });
    }
  } catch (error) {
    console.error("Payment success handler error:", error);
    return new Response("Error processing payment callback", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
