import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const formData = await req.formData();
    const transactionId = formData.get("tran_id") as string;
    const status = formData.get("status") as string;

    console.log("Payment failure callback:", { transactionId, status });

    // Update order status to failed
    await supabase
      .from("orders")
      .update({ status: "failed" })
      .eq("id", transactionId);

    // Redirect to failure page
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${
          Deno.env.get("FRONTEND_URL_ESHOP") || "http://localhost:8080"
        }/payment-success?payment=failed&order=${transactionId}`,
      },
    });
  } catch (error) {
    console.error("Payment failure handler error:", error);
    return new Response("Error processing payment failure", { status: 500 });
  }
});
