import React, { useState } from "react";
import { Button, Table, Popconfirm, message } from "antd";
import EmployeeModal from "../components/EmployeeModal";

interface Employee {
  key: string;
  name: string;
  workLocation: string;
}

const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const showModal = () => setIsVisible(true);
  const hideModal = () => {
    setIsVisible(false);
    setEditingEmployee(null);
  };

  const handleAddOrEditEmployee = (employee: Employee) => {
    setEmployees((prev) =>
      editingEmployee
        ? prev.map((emp) => (emp.key === editingEmployee.key ? employee : emp))
        : [...prev, employee]
    );

    hideModal();
  };

  const handleDelete = (key: string) => {
    setEmployees((prev) => prev.filter((e) => e.key !== key));
    message.success("Employee deleted successfully!");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Work Location",
      dataIndex: "workLocation",
      key: "workLocation",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Employee) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingEmployee(record);
              showModal();
            }}
          >
            ✏️ Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              🗑️ Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Add Employee
      </Button>

      <Table dataSource={employees} columns={columns} rowKey="key" />

      <EmployeeModal
        visible={isVisible}
        onClose={hideModal}
        onSubmit={handleAddOrEditEmployee}
        initialValues={editingEmployee || undefined}
      />
    </div>
  );
};

export default Dashboard;
