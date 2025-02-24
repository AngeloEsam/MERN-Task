import { Modal, Form, Input, Select, Button } from "antd";
import React, { useEffect } from "react";

interface Employee {
  key: string;
  name: string;
  workLocation: string;
}

interface EmployeeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Employee) => void;
  initialValues?: Employee;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleFinish = (values: Employee) => {
    onSubmit({ ...values, key: initialValues?.key || Date.now().toString() });
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={initialValues ? "Edit Employee" : "Add Employee"}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Work Location"
          name="workLocation"
          rules={[{ required: true, message: "Please select a location" }]}
        >
          <Select>
            <Select.Option value="Home">Home</Select.Option>
            <Select.Option value="Office">Office</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Submit
        </Button>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;
