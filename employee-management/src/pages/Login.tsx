import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, message, Form } from "antd";
import { loginUser } from "../services/authService";
import { LoginFormData } from "../types/User";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const navigate = useNavigate();
  const onSubmit = async (data: LoginFormData) => {
    if (!data.email || !data.password) {
      return;
    }
    try {
      setLoading(true);
      const response = await loginUser(data);
      setLoading(false);

      if (!response?.token) {
        throw new Error("Invalid credentials or empty response.");
      }
      localStorage.setItem("token", response.token);
      message.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      setLoading(false);
      message.error(
        error.message || "Login failed! Please check your credentials."
      );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}>
      <h2>Login</h2>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <Input {...field} placeholder="Enter your email" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Enter your password" />
            )}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
