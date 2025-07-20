import React from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Checkbox, Form, Input, Flex, Typography } from "antd";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const res = await fetch("https://localhost:5000/api/Auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("user", JSON.stringify(data));
                navigate("/");
            } else {
                alert(data?.message || "An error occurred.");
            }
        } catch (error) {
            alert("Network error or server is down.");
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
                        Sign in
                    </Typography.Title>

                    <Form name="login" onFinish={onFinish} layout="vertical" className="space-y-4">
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: "Please input your email!" },
                                { type: "email", message: "Invalid email!" },
                            ]}
                        >
                            <div>
                                <Typography.Title level={5}>Email</Typography.Title>
                                <Input prefix={<MailOutlined />} placeholder="Enter your email" size="large" />
                            </div>
                        </Form.Item>

                        <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }]}>
                            <div>
                                <Typography.Title level={5}>Password</Typography.Title>
                                <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" size="large" />
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <Flex justify="space-between" align="center">
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>
                                <a href="#" className="text-orange-600 hover:text-orange-500">Forgot password?</a>
                            </Flex>
                        </Form.Item>

                        <Form.Item>
                            <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
                                Sign in
                            </button>
                        </Form.Item>

                        <div className="text-center">
                            Don’t have an account?{" "}
                            <Link to="/register" className="text-orange-600 hover:underline">
                                Register
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Login;
