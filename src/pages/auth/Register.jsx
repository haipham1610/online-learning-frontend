import React from "react";
import { LockOutlined, MailOutlined, SafetyOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const passwordRules = [
        { required: true, message: "Please input your password!" },
        { min: 8, message: "Password must be at least 8 characters!" },
        { pattern: /(?=.*[a-z])/, message: "Password must contain at least one lowercase letter!" },
        { pattern: /(?=.*[A-Z])/, message: "Password must contain at least one uppercase letter!" },
        { pattern: /(?=.*\d)/, message: "Password must contain at least one number!" },
        { pattern: /(?=.*[!@#$%^&*])/, message: "Password must contain at least one special character!" },
    ];

    const onFinish = async (values) => {
        const normalizedEmail = values.email.trim().toLowerCase();
        try {
            // Gọi API send-otp với đầy đủ thông tin
            const res = await fetch("https://localhost:5000/api/Auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: normalizedEmail,
                    type: "register",
                    username: values.username,
                    password: values.password
                }),
            });

            const data = await res.json();

            if (res.ok) {
                message.success("OTP has been sent to your email!");
                navigate("/otp", {
                    state: {
                        email: normalizedEmail,
                        username: values.username,
                        password: values.password,
                        type: "register",
                    },
                });
            } else {
                message.error(data?.message || "Failed to send OTP.");
            }
        } catch (error) {
            message.error("Network error or server is down.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img className="mx-auto h-12 w-auto" src="/img/logo.png" alt="Logo" />
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Typography.Title level={3} className="text-center">
                        Register
                    </Typography.Title>

                    <Form name="register" onFinish={onFinish} layout="vertical" className="space-y-4">
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: "Please input your username!" }, { min: 3 }]}
                        >
                            <div>
                                <Typography.Title level={5}>Username</Typography.Title>
                                <Input prefix={<UserOutlined />} placeholder="Enter your username" size="large" />
                            </div>
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: "Please input your email!" }, { type: "email" }]}
                        >
                            <div>
                                <Typography.Title level={5}>Email</Typography.Title>
                                <Input prefix={<MailOutlined />} placeholder="Enter your email" size="large" />
                            </div>
                        </Form.Item>

                        <Form.Item name="password" rules={passwordRules}>
                            <div>
                                <Typography.Title level={5}>Password</Typography.Title>
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Enter your password"
                                    size="large"
                                />
                            </div>
                        </Form.Item>

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
                                        return Promise.reject(new Error("Passwords do not match!"));
                                    },
                                }),
                            ]}
                        >
                            <div>
                                <Typography.Title level={5}>Confirm password</Typography.Title>
                                <Input.Password
                                    prefix={<SafetyOutlined />}
                                    placeholder="Confirm your password"
                                    size="large"
                                />
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <button
                                type="submit"
                                className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
                            >
                                Send OTP
                            </button>
                        </Form.Item>

                        <div className="text-center">
                            Already have an account?{" "}
                            <Link to="/login" className="text-orange-600 hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Register;
