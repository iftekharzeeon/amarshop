// Test SSLCommerz credentials
const testCredentials = async () => {
  const formData = new FormData();
  formData.append("store_id", "secur686b7b6d28f32");
  formData.append("store_passwd", "secur686b7b6d28f32@ssl");
  formData.append("total_amount", "100");
  formData.append("currency", "BDT");
  formData.append("tran_id", "test_" + Date.now());
  formData.append("success_url", "https://example.com/success");
  formData.append("fail_url", "https://example.com/fail");
  formData.append("cancel_url", "https://example.com/cancel");
  formData.append("cus_name", "Test Customer");
  formData.append("cus_email", "test@example.com");
  formData.append("cus_add1", "Test Address");
  formData.append("cus_city", "Dhaka");
  formData.append("cus_state", "Dhaka");
  formData.append("cus_postcode", "1000");
  formData.append("cus_country", "Bangladesh");
  formData.append("cus_phone", "01700000000");
  formData.append("ship_name", "Test Customer");
  formData.append("ship_add1", "Test Address");
  formData.append("ship_city", "Dhaka");
  formData.append("ship_state", "Dhaka");
  formData.append("ship_postcode", "1000");
  formData.append("ship_country", "Bangladesh");
  formData.append("product_name", "Test Product");
  formData.append("product_category", "Electronics");
  formData.append("product_profile", "general");

  try {
    const response = await fetch(
      "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", result);

    return result;
  } catch (error) {
    console.error("Error:", error);
    return error.message;
  }
};

testCredentials();
