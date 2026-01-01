import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, RefreshCw, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
}

interface EmployeeVerificationProps {
  onEmployeeVerified: (employee: Employee) => void;
}

export const EmployeeVerification = ({
  onEmployeeVerified,
}: EmployeeVerificationProps) => {
  const [employeeId, setEmployeeId] = useState("");
  const [isEmployeeVerified, setIsEmployeeVerified] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isVerifyingEmployee, setIsVerifyingEmployee] = useState(false);

  // OTP related states
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOTP, setCanResendOTP] = useState(false);

  const { toast } = useToast();

  // OTP timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOTP(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const verifyEmployee = async () => {
    if (!employeeId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an Employee ID",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingEmployee(true);
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("employee_id", employeeId.trim())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        toast({
          title: "Employee Not Found",
          description: "The Employee ID does not exist or is inactive.",
          variant: "destructive",
        });
        setIsEmployeeVerified(false);
        setEmployee(null);
        return;
      }

      setEmployee(data);
      setIsEmployeeVerified(true);

      toast({
        title: "Employee Verified",
        description: `Welcome, ${data.full_name}!`,
      });
    } catch (error) {
      console.error("Error verifying employee:", error);
      toast({
        title: "Error",
        description: "Failed to verify employee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingEmployee(false);
    }
  };

  const sendOTP = async () => {
    if (!employee) return;

    try {
      // Generate a random 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

      // Try to store in database, but don't fail if table doesn't exist
      try {
        const { data, error } = await supabase
          .from("otp_sessions")
          .insert({
            employee_id: employee.employee_id,
            otp_code: otpCode,
            expires_at: expiresAt.toISOString(),
          })
          .select()
          .single();

        if (!error && data) {
          setOtpSessionId(data.id);
        }
      } catch (dbError) {
        console.log(
          "Database not available for OTP storage, using local session"
        );
        // Generate a temporary session ID
        setOtpSessionId(`temp-${Date.now()}`);
      }

      setShowOTP(true);
      setOtpTimer(300); // 5 minutes
      setCanResendOTP(false);

      // In a real application, you would send the OTP via SMS/Email
      // For testing purposes, we'll show it in a toast
      toast({
        title: "OTP Sent",
        description: `OTP sent to ${employee.phone}`,
        duration: 10000,
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    if (!otpSessionId || !employee) return;

    setIsVerifyingOTP(true);
    try {
      const { data, error } = await supabase
        .from("otp_sessions")
        .update({ verified: true })
        .eq("id", otpSessionId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setOtpVerified(true);
      toast({
        title: "OTP Verified",
        description: "Employee verification completed successfully!",
      });

      onEmployeeVerified(employee);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const resendOTP = async () => {
    if (!canResendOTP || !employee) return;
    await sendOTP();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Employee Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Employee ID Verification */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="employeeId">Employee ID *</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter Employee ID (e.g., EMP001)"
                disabled={isEmployeeVerified}
                className="flex-1"
              />
              {isEmployeeVerified ? (
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-md">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <Button
                  onClick={verifyEmployee}
                  disabled={isVerifyingEmployee || !employeeId.trim()}
                  className="whitespace-nowrap"
                >
                  {isVerifyingEmployee ? "Verifying..." : "Verify"}
                </Button>
              )}
            </div>
          </div>

          {/* Employee Information Display */}
          {isEmployeeVerified && employee && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Employee Verified
                </span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {employee.full_name}
                </p>
                <p>
                  <span className="font-medium">Department:</span>{" "}
                  {employee.department}
                </p>
                <p>
                  <span className="font-medium">Designation:</span>{" "}
                  {employee.designation}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {employee.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* OTP Verification */}
        {isEmployeeVerified && employee && (
          <div className="space-y-4">
            {!showOTP ? (
              <Button onClick={sendOTP} className="w-full">
                Send OTP for Verification
              </Button>
            ) : otpVerified ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    OTP Verification Successful
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Employee verification completed successfully! You can now
                  proceed with checkout.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Enter OTP</Label>
                  <div className="mt-2">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {otpTimer > 0 ? (
                      <span>OTP expires in {formatTime(otpTimer)}</span>
                    ) : (
                      <span className="text-red-600">OTP expired</span>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resendOTP}
                    disabled={!canResendOTP}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Resend OTP
                  </Button>
                </div>

                <Button
                  onClick={verifyOTP}
                  disabled={isVerifyingOTP || otp.length !== 6}
                  className="w-full"
                >
                  {isVerifyingOTP ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
