import React, { useState } from "react";
import {
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Checkbox, Form, Input, Flex, Typography } from "antd";

function Auth() {
  const [activeTab, setActiveTab] = useState("login");

  const passwordRules = [
    { required: true, message: "Please input your password!" },
    { min: 8, message: "Password must be at least 8 characters!" },
    {
      pattern: /^(?=.*[a-z])/,
      message: "Password must contain at least one lowercase letter!",
    },
    {
      pattern: /^(?=.*[A-Z])/,
      message: "Password must contain at least one uppercase letter!",
    },
    {
      pattern: /^(?=.*\d)/,
      message: "Password must contain at least one number!",
    },
    {
      pattern: /^(?=.*[!@#$%^&*])/,
      message: "Password must contain at least one special character (!@#$%^&*)!",
    },
  ];

  const onFinish = async (values) => {
    console.log("Form values:", values);

    const baseUrl = "https://localhost:5000/api/Auth";

    try {
      let res;
      if (activeTab === "login") {
        res = await fetch(`${baseUrl}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });
      } else {
        res = await fetch(`${baseUrl}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            username: values.username,
          }),
        });
      }

      const data = await res.json();

      if (res.ok) {
        alert(`${activeTab === "login" ? "Login" : "Register"} successful!`);
        console.log("Response:", data);
      } else {
        alert(data?.message || "An error occurred.");
        console.error("Error:", data);
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Network error or server is down.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-12 w-auto" src="img/logo.png" alt="Your Company" />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === "login"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              onClick={() => setActiveTab("login")}
            >
              Sign in
            </button>
            <button
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === "register"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>

          <Form
            name="auth"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            className="space-y-4"
          >
            {activeTab === "register" && (
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                  { min: 3, message: "Username must be at least 3 characters!" },
                ]}
              >
                <div>
                  <Typography.Title level={5}>Username</Typography.Title>
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your username"
                    size="large"
                  />
                </div>
              </Form.Item>
            )}

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <div>
                <Typography.Title level={5}>Email</Typography.Title>
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  size="large"
                />
              </div>
            </Form.Item>

            <Form.Item name="password" rules={passwordRules}>
              <div>
                <Typography.Title level={5}>Password</Typography.Title>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter password"
                  size="large"
                />
              </div>
            </Form.Item>

            {activeTab === "register" && (
              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <div>
                  <Typography.Title level={5}>Confirm password</Typography.Title>
                  <Input.Password
                    prefix={<SafetyOutlined />}
                    placeholder="Confirm password"
                    size="large"
                  />
                </div>
              </Form.Item>
            )}

            {activeTab === "login" && (
              <Form.Item>
                <Flex justify="space-between" align="center">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>
                  <a href="#" className="text-orange-600 hover:text-orange-500">
                    Forgot password?
                  </a>
                </Flex>
              </Form.Item>
            )}

            <Form.Item>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                {activeTab === "login" ? "Sign in" : "Register"}
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Auth;
