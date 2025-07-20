import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography, message } from "antd";
import { MailOutlined, ClockCircleOutlined } from "@ant-design/icons";

function Otp() {
  const [form] = Form.useForm();
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { email, type, username, password } = location.state || {};

  // Kiểm tra thông tin đầu vào
  useEffect(() => {
    if (!email || !type) {
      message.error("Missing required information. Redirecting...");
      navigate("/login");
    }
  }, [email, type, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && isResendDisabled) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsResendDisabled(false);
    }
  }, [timeLeft, isResendDisabled]);

  const apiUrl = "http://localhost:5000"; // ⚠️ Không dùng https để tránh lỗi

  const onFinish = async (values) => {
    if (!email || !type) {
      message.error("Missing email or type information");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          otpCode: values.otp.toString(),
          type: type.trim(),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "OTP verification failed.";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        message.error(errorMessage);
        return;
      }

      const data = await res.json();
      message.success("OTP verified successfully!");

      if (type === "register") {
        // Gửi request đăng ký sau khi xác minh OTP
        const registerRes = await fetch(`${apiUrl}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
        });

        const registerData = await registerRes.json();
        if (registerRes.ok) {
          message.success("Register successful! Please login.");
          navigate("/login");
        } else {
          message.error(registerData.message || "Register failed after OTP.");
        }
      } else if (type === "reset-password") {
        navigate("/reset-password", { state: { email, verified: true } });
      }

    } catch (err) {
      console.error("OTP verification error:", err);
      if (err.name === 'AbortError') {
        message.error("Request timeout. Please try again.");
      } else {
        message.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email || !type) {
      message.error("Missing email or type information");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          type: type.trim()
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Failed to resend OTP.";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }

        message.error(errorMessage);
        return;
      }

      const data = await res.json();
      message.success("OTP resent to your email.");
      setIsResendDisabled(true);
      setTimeLeft(60);

    } catch (error) {
      console.error("Resend OTP error:", error);
      message.error("Network error while resending OTP.");
    }
  };

  if (!email || !type) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Typography.Title level={2} className="text-center">
          Verify your Email
        </Typography.Title>
        <p className="text-center text-gray-600 mt-2">
          We've sent a verification code to {email}
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form form={form} name="otp" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="otp"
              rules={[
                { required: true, message: "Please enter the OTP." },
                { len: 6, message: "OTP must be 6 digits." },
                { pattern: /^\d{6}$/, message: "OTP must contain only numbers." },
              ]}
            >
              <Input
                size="large"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                prefix={<MailOutlined />}
                autoComplete="one-time-code"
              />
            </Form.Item>

            <div className="text-center mb-4">
              {isResendDisabled ? (
                <span className="text-sm text-gray-500">
                  <ClockCircleOutlined /> Resend in {timeLeft}s
                </span>
              ) : (
                <Button type="link" onClick={handleResendOTP}>
                  Resend OTP
                </Button>
              )}
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-orange-600"
                loading={loading}
              >
                Verify
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Otp;
