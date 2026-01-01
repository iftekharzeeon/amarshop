import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmployeeVerification } from "@/components/EmployeeVerification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SITE_CONFIG, formatPrice } from "@/lib/constants";
import {
  ShoppingCart,
  CreditCard,
  Shield,
  CheckCircle,
  User,
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const cartItems: CartItem[] = location.state?.cartItems || [];

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [verifiedEmployee, setVerifiedEmployee] = useState<Employee | null>(
    null
  );

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleEmployeeVerified = (employee: Employee) => {
    setVerifiedEmployee(employee);
    // Auto-fill the customer information with employee details
    setFormData({
      customerName: employee.full_name,
      customerEmail: employee.email,
      customerPhone: employee.phone,
      shippingAddress: formData.shippingAddress, // Keep existing address if any
    });

    toast({
      title: "Employee Verified",
      description:
        "Customer information has been auto-filled with employee details.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      toast({
        title: "Processing Payment",
        description: "Redirecting to SSLCommerz payment gateway...",
      });

      // Use Supabase functions.invoke for better error handling and authentication
      const { data, error } = await supabase.functions.invoke(
        "sslcommerz-payment",
        {
          body: {
            orderData: formData,
            cartItems,
            totalAmount,
          },
        }
      );

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Payment initialization failed");
      }

      if (data && data.success) {
        // Redirect to SSLCommerz payment gateway
        window.location.href = data.gatewayPageURL;
      } else {
        throw new Error(data?.error || "Payment initialization failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header cartItemCount={0} onCartOpen={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-6">
            Add some items to your cart to proceed with checkout.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary/90"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header cartItemCount={itemCount} onCartOpen={() => {}} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">
            Complete your order securely with {SITE_CONFIG.PAYMENT_GATEWAY}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>৳0</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Gateway Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold mb-4">Secure Payment with</h3>
                  <img
                    src={SITE_CONFIG.PAYMENT_LOGO}
                    alt="SSLCommerz Payment Gateway"
                    className="mx-auto h-auto mb-4"
                  />
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <p>Developed by</p>
                    <img
                      src={SITE_CONFIG.DEVELOPER_LOGO}
                      alt={SITE_CONFIG.DEVELOPER_NAME}
                      className="h-5 w-auto"
                    />
                    <div></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Information Form */}
          <div className="space-y-6">
            {/* Employee Verification Section */}
            <EmployeeVerification onEmployeeVerified={handleEmployeeVerified} />

            {/* Customer Information Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Customer Information
                  {verifiedEmployee && (
                    <Badge variant="secondary" className="ml-2">
                      Verified Employee
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        className="mt-1"
                        readOnly={!!verifiedEmployee}
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerEmail">Email Address *</Label>
                      <Input
                        id="customerEmail"
                        name="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email address"
                        className="mt-1"
                        readOnly={!!verifiedEmployee}
                      />
                    </div>

                    <div>
                      <Label htmlFor="customerPhone">Phone Number</Label>
                      <Input
                        id="customerPhone"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="mt-1"
                        readOnly={!!verifiedEmployee}
                      />
                    </div>

                    <div>
                      <Label htmlFor="shippingAddress">Shipping Address</Label>
                      <Textarea
                        id="shippingAddress"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        placeholder="Enter your shipping address"
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Your order will be processed securely</span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-white py-3"
                      disabled={
                        isLoading ||
                        !formData.customerName ||
                        !formData.customerEmail ||
                        !verifiedEmployee
                      }
                      size="lg"
                    >
                      {isLoading ? (
                        "Processing..."
                      ) : (
                        <>
                          Pay {formatPrice(totalAmount)} with{" "}
                          {SITE_CONFIG.PAYMENT_GATEWAY}
                        </>
                      )}
                    </Button>

                    {!verifiedEmployee && (
                      <p className="text-xs text-orange-600 text-center">
                        Please complete employee verification before proceeding.
                      </p>
                    )}

                    <p className="text-xs text-gray-500 text-center">
                      By clicking "Pay Now", you agree to our terms and
                      conditions.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
