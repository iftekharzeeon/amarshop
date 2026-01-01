import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { SITE_CONFIG } from "@/lib/constants";

export const PaymentStatus = () => {
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment");
    const orderId = urlParams.get("order");

    if (paymentStatus && orderId) {
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);

      switch (paymentStatus) {
        case "success":
          toast({
            title: "Payment Successful!",
            description: `Your order ${orderId} has been confirmed. Thank you for shopping with ${SITE_CONFIG.SITE_NAME}!`,
            duration: 5000,
          });
          break;
        case "failed":
          toast({
            title: "Payment Failed",
            description: `Unfortunately, your payment for order ${orderId} could not be processed. Please try again.`,
            variant: "destructive",
            duration: 5000,
          });
          break;
        case "cancelled":
          toast({
            title: "Payment Cancelled",
            description: `Your payment for order ${orderId} was cancelled. You can try again whenever you're ready.`,
            variant: "destructive",
            duration: 5000,
          });
          break;
      }
    }
  }, [toast]);

  return null;
};
