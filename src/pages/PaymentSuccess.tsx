import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  ShoppingBag,
  CreditCard,
  Calendar,
  Hash,
  Building,
} from "lucide-react";
import { SITE_CONFIG, formatPrice } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";

interface OrderDetails {
  id: string;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  transaction_id: string;
  created_at: string;
  status: string;
}

// Add print styles
const printStyles = `
  @media print {
    .no-print {
      display: none !important;
    }
    
    .print-container {
      margin: 0 !important;
      padding: 20px !important;
      background: white !important;
    }
    
    .print-card {
      border: none !important;
      box-shadow: none !important;
      margin: 0 !important;
    }
    
    .print-title {
      display: block !important;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #000;
    }
    
    body {
      background: white !important;
    }
    
    .container {
      max-width: none !important;
      padding: 0 !important;
      margin: 0 !important;
    }
  }
  
  .print-title {
    display: none;
  }
`;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("order");
  const paymentStatus = searchParams.get("payment");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        navigate("/");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error) {
          console.error("Error fetching order:", error);
          navigate("/");
          return;
        }

        setOrderDetails(data);
      } catch (error) {
        console.error("Error:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header cartItemCount={0} onCartOpen={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header cartItemCount={0} onCartOpen={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order not found
          </h1>
          <p className="text-gray-600 mb-6">
            The order you're looking for could not be found.
          </p>
          <Button onClick={() => navigate("/")}>Return to Store</Button>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (paymentStatus) {
      case "success":
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-600" />,
          title: "Payment Successful!",
          description:
            "Thank you for your purchase. Your order has been confirmed and will be processed shortly.",
          bgColor: "bg-green-100",
          badgeColor: "bg-green-100 text-green-800",
        };
      case "failed":
        return {
          icon: <div className="h-12 w-12 text-red-600">❌</div>,
          title: "Payment Failed",
          description:
            "Unfortunately, your payment could not be processed. Please try again or contact support.",
          bgColor: "bg-red-100",
          badgeColor: "bg-red-100 text-red-800",
        };
      case "cancelled":
        return {
          icon: <div className="h-12 w-12 text-yellow-600">⚠️</div>,
          title: "Payment Cancelled",
          description:
            "Your payment was cancelled. You can try again or continue shopping.",
          bgColor: "bg-yellow-100",
          badgeColor: "bg-yellow-100 text-yellow-800",
        };
      default:
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-600" />,
          title: "Order Details",
          description: "Here are the details of your order.",
          bgColor: "bg-blue-100",
          badgeColor: "bg-blue-100 text-blue-800",
        };
    }
  };

  const statusInfo = getStatusInfo();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <style>{printStyles}</style>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="no-print">
          <Header cartItemCount={0} onCartOpen={() => {}} />
        </div>

        <div className="container mx-auto px-4 py-8 print-container">
          {/* Success Header */}
          <div className="text-center mb-8 no-print">
            <div
              className={`mx-auto w-20 h-20 ${statusInfo.bgColor} rounded-full flex items-center justify-center mb-4`}
            >
              {statusInfo.icon}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {statusInfo.title}
            </h1>
            <p className="text-gray-600">{statusInfo.description}</p>
          </div>

          {/* Order Details */}
          <div className="max-w-2xl mx-auto">
            <h1 className="print-title">Payment Receipt</h1>
            <Card className="print-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Confirmation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order Status</span>
                  <Badge className={statusInfo.badgeColor}>
                    {paymentStatus === "success" &&
                    orderDetails.status === "completed"
                      ? "Confirmed"
                      : paymentStatus === "failed"
                      ? "Failed"
                      : paymentStatus === "cancelled"
                      ? "Cancelled"
                      : orderDetails.status}
                  </Badge>
                </div>

                <Separator />

                {/* Order Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Transaction ID</p>
                        <p className="font-medium">{orderDetails.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-medium">
                          {formatDate(orderDetails.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Bank ID</p>
                        <p className="font-medium">
                          {orderDetails.transaction_id || "Processing"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Payment Gateway</p>
                        <p className="font-medium">
                          {SITE_CONFIG.PAYMENT_GATEWAY}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Customer Information */}
                <div>
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name</span>
                      <span className="font-medium">
                        {orderDetails.customer_name}
                      </span>
                    </div>
                    {orderDetails.customer_phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone</span>
                        <span className="font-medium">
                          {orderDetails.customer_phone}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email</span>
                      <span className="font-medium">
                        {orderDetails.customer_email}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payment Summary */}
                <div>
                  <h3 className="font-semibold mb-3">Payment Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatPrice(orderDetails.total_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>৳0</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Paid</span>
                      <span>{formatPrice(orderDetails.total_amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 no-print">
                  <Button
                    onClick={() => navigate("/")}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.print()}
                    className="flex-1"
                  >
                    Print Receipt
                  </Button>
                </div>

                {/* Contact Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Need Help?
                  </h4>
                  <p className="text-blue-700 text-sm mb-2">
                    If you have any questions about your order, please contact
                    our support team:
                  </p>
                  <div className="text-blue-700 text-sm space-y-1">
                    <p>Email: {SITE_CONFIG.SUPPORT_EMAIL}</p>
                    <p>Phone: {SITE_CONFIG.SUPPORT_PHONE}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="no-print">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
