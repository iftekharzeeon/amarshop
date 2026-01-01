import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const formData = await req.formData();
    const transactionId = formData.get("tran_id") as string;

    console.log("Payment cancelled:", { transactionId });

    // Update order status to cancelled
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", transactionId);

    // Redirect to cancel page
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${
          Deno.env.get("FRONTEND_URL_ESHOP") || "http://localhost:8080"
        }/payment-success?payment=cancelled&order=${transactionId}`,
      },
    });
  } catch (error) {
    console.error("Payment cancel handler error:", error);
    return new Response("Error processing payment cancellation", {
      status: 500,
    });
  }
});
