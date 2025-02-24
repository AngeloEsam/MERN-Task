import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Upload, message, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }
    setFileList([file]);
    return false;
  };
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (fileList.length === 0) {
        message.warning("Please upload a profile picture.");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("profilePicture", fileList[0]);

      const response = await registerUser(formData);
      console.log("Register Response: " + response);
      message.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}>
      <h2>Register</h2>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
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
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Enter your password" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Profile Picture"
          name="profilePicture"
        >
          <Upload
            beforeUpload={beforeUpload}
            fileList={fileList}
            listType="picture"
            multiple={false}
            maxCount={1}
            onRemove={() => setFileList([])}
          >
            <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Register
        </Button>
      </Form>
    </div>
  );
};

export default Register;
