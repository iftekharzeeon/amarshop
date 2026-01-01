import { createClient } from "jsr:@supabase/supabase-js@2";

// Site configuration constants
const SITE_CONFIG = {
  // E-commerce site branding
  SITE_NAME: "e-Shop",
  ORGANIZATION_NAME: "Aaron Denim Ltd.",
  SITE_TAGLINE: "Your Trusted Online Store",
  ORGANIZATION_LOGO: "/aaron.jpeg",

  // Developer branding
  DEVELOPER_NAME: "Pridesys IT Ltd",
  DEVELOPER_LOGO: "/Pridesys-It-Ltd.svg",
  DEVELOPER_FAVICON: "/pridesys_favicon.jpeg",
  DEVELOPER_WEBSITE: "https://pridesys.com",

  // Payment gateway
  PAYMENT_GATEWAY: "SSLCommerz",
  PAYMENT_LOGO:
    "https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-05.png",
  PAYMENT_LOGO_LARGE:
    "https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-03.png",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress?: string;
  };
  cartItems: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { orderData, cartItems, totalAmount }: PaymentRequest =
      await req.json();

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        total_amount: totalAmount,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        shipping_address: orderData.shippingAddress,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw new Error("Failed to create order");
    }

    // Create order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
    }));

    await supabase.from("order_items").insert(orderItems);

    // Prepare SSLCommerz payment data
    const sslcommerzData = new FormData();
    const storeId = Deno.env.get("SSLCOMMERZ_STORE_ID");
    const storePassword = Deno.env.get("SSLCOMMERZ_STORE_PASSWORD");

    console.log("SSLCommerz Store ID:", storeId);
    console.log("SSLCommerz Store Password exists:", !!storePassword);
    console.log("Order ID:", order.id);
    console.log("Total Amount:", totalAmount);

    sslcommerzData.append("store_id", storeId!);
    sslcommerzData.append("store_passwd", storePassword!);
    sslcommerzData.append("total_amount", totalAmount.toString());
    sslcommerzData.append("currency", "BDT");
    sslcommerzData.append("tran_id", order.id);
    sslcommerzData.append(
      "success_url",
      `${supabaseUrl}/functions/v1/sslcommerz-success`
    );
    sslcommerzData.append(
      "fail_url",
      `${supabaseUrl}/functions/v1/sslcommerz-fail`
    );
    sslcommerzData.append(
      "cancel_url",
      `${supabaseUrl}/functions/v1/sslcommerz-cancel`
    );
    sslcommerzData.append(
      "ipn_url",
      `${supabaseUrl}/functions/v1/sslcommerz-ipn`
    );

    // Customer information
    sslcommerzData.append("cus_name", orderData.customerName);
    sslcommerzData.append("cus_email", orderData.customerEmail);
    sslcommerzData.append("cus_add1", orderData.shippingAddress || "N/A");
    sslcommerzData.append("cus_city", "Dhaka");
    sslcommerzData.append("cus_state", "Dhaka");
    sslcommerzData.append("cus_postcode", "1000");
    sslcommerzData.append("cus_country", "Bangladesh");
    sslcommerzData.append(
      "cus_phone",
      orderData.customerPhone || "01700000000"
    );

    // Shipping information (same as billing)
    sslcommerzData.append("ship_name", orderData.customerName);
    sslcommerzData.append("ship_add1", orderData.shippingAddress || "N/A");
    sslcommerzData.append("ship_city", "Dhaka");
    sslcommerzData.append("ship_state", "Dhaka");
    sslcommerzData.append("ship_postcode", "1000");
    sslcommerzData.append("ship_country", "Bangladesh");

    // Product information
    sslcommerzData.append("product_name", "E-commerce Order");
    sslcommerzData.append("product_category", "Groceries");
    sslcommerzData.append("product_profile", "general");

    // Required shipping method parameter
    sslcommerzData.append("shipping_method", "YES");

    // Store customization - use site logo for better branding
    sslcommerzData.append("value_a", SITE_CONFIG.SITE_NAME); // Store name
    sslcommerzData.append("value_b", SITE_CONFIG.ORGANIZATION_NAME); // Developer attribution

    // Create SSLCommerz session
    console.log("Making request to SSLCommerz...");

    // Determine environment (sandbox or live)
    const sslcommerzEnvironment =
      Deno.env.get("SSLCOMMERZ_ENVIRONMENT") || "sandbox";
    const sslcommerzUrl =
      sslcommerzEnvironment === "live"
        ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
        : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

    console.log("SSLCommerz Environment:", sslcommerzEnvironment);
    console.log("SSLCommerz URL:", sslcommerzUrl);

    const sslcommerzResponse = await fetch(sslcommerzUrl, {
      method: "POST",
      body: sslcommerzData,
    });

    console.log("SSLCommerz HTTP Status:", sslcommerzResponse.status);
    console.log(
      "SSLCommerz Headers:",
      Object.fromEntries(sslcommerzResponse.headers.entries())
    );

    const responseText = await sslcommerzResponse.text();
    console.log("SSLCommerz Raw Response:", responseText);

    let sslcommerzResult;
    try {
      sslcommerzResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse SSLCommerz response as JSON:", parseError);
      throw new Error("Invalid response from payment gateway");
    }

    console.log("SSLCommerz Response Status:", sslcommerzResponse.status);
    console.log(
      "SSLCommerz Response:",
      JSON.stringify(sslcommerzResult, null, 2)
    );

    if (sslcommerzResult.status === "SUCCESS") {
      // Update order with session ID
      await supabase
        .from("orders")
        .update({ sslcommerz_session_id: sslcommerzResult.sessionkey })
        .eq("id", order.id);

      return new Response(
        JSON.stringify({
          success: true,
          sessionKey: sslcommerzResult.sessionkey,
          gatewayPageURL: sslcommerzResult.GatewayPageURL,
          orderId: order.id,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      console.error("SSLCommerz error:", sslcommerzResult);
      throw new Error("Payment session creation failed");
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Payment processing failed",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
