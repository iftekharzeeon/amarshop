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

  console.log("SSLCommerz IPN received", {
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

    // Parse IPN data
    const formData = await req.formData();
    const transactionId = formData.get("tran_id") as string;
    const status = formData.get("status") as string;
    const amount = formData.get("amount") as string;
    const currency = formData.get("currency") as string;
    const bankTransactionId = formData.get("bank_tran_id") as string;
    const storeAmount = formData.get("store_amount") as string;
    const bankGwName = formData.get("bank_gw") as string;
    const riskLevel = formData.get("risk_level") as string;
    const riskTitle = formData.get("risk_title") as string;

    console.log("IPN Data:", {
      transactionId,
      status,
      amount,
      currency,
      bankTransactionId,
      storeAmount,
      bankGwName,
      riskLevel,
      riskTitle,
    });

    // Validate the IPN with SSLCommerz
    const storeId = Deno.env.get("SSLCOMMERZ_STORE_ID");
    const storePassword = Deno.env.get("SSLCOMMERZ_STORE_PASSWORD");
    const sslcommerzEnvironment =
      Deno.env.get("SSLCOMMERZ_ENVIRONMENT") || "sandbox";

    const validationUrl =
      sslcommerzEnvironment === "live"
        ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
        : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

    const validationData = new URLSearchParams();
    validationData.append("store_id", storeId!);
    validationData.append("store_passwd", storePassword!);
    validationData.append("v1", transactionId);
    validationData.append("v2", amount);
    validationData.append("format", "json");

    console.log("Validating with SSLCommerz:", validationUrl);

    const validationResponse = await fetch(validationUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const validationResult = await validationResponse.json();
    console.log("Validation Result:", validationResult);

    // Check validation status
    if (
      validationResult.status === "VALID" ||
      validationResult.status === "VALIDATED"
    ) {
      // Update order status in database
      const updateData: Record<string, any> = {
        status: status.toLowerCase(),
        bank_transaction_id: bankTransactionId,
        payment_gateway_data: {
          bank_gw: bankGwName,
          store_amount: storeAmount,
          risk_level: riskLevel,
          risk_title: riskTitle,
          validation_status: validationResult.status,
          validated_at: new Date().toISOString(),
        },
      };

      // Handle different payment statuses
      if (status === "VALID") {
        updateData.status = "completed";
        updateData.paid_at = new Date().toISOString();

        // Check risk level - if risk_level = 1, mark for manual verification
        if (riskLevel === "1") {
          updateData.status = "pending_verification";
          updateData.requires_verification = true;
          console.log("High risk transaction - marked for verification");
        }
      } else if (status === "FAILED") {
        updateData.status = "failed";
      } else if (status === "CANCELLED") {
        updateData.status = "cancelled";
      }

      const { error: updateError } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", transactionId);

      if (updateError) {
        console.error("Error updating order:", updateError);
        throw new Error("Failed to update order status");
      }

      console.log(
        `Order ${transactionId} updated successfully with status: ${updateData.status}`
      );

      return new Response("IPN processed successfully", {
        status: 200,
        headers: corsHeaders,
      });
    } else {
      console.error("Invalid IPN - validation failed:", validationResult);
      return new Response("Invalid IPN", {
        status: 400,
        headers: corsHeaders,
      });
    }
  } catch (error) {
    console.error("IPN processing error:", error);
    return new Response("IPN processing failed", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
