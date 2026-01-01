// Simple test function to verify deployment
Deno.serve(async (req) => {
  console.log("Test callback received");

  // Always redirect to success page for testing
  return new Response(null, {
    status: 302,
    headers: {
      Location:
        "https://hqnijhldgvdokmvvlaco.lovable.app/payment-success?payment=success&order=test-order-123",
    },
  });
});
