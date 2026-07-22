import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useFetch } from "../hooks/useFetch";
import { getErrorMessage } from "../utils/getErrorMessage";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api/employee.api";
import { getDepartments } from "../api/department.api";
import type { Employee } from "../types/hrms.types";
import PageHeader from "../components/layout/PageHeader";
import Table from "../components/ui/Table";
import type { Column } from "../components/ui/Table";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";

const EmployeesPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user?.role === "admin";

  const { data: employees, isLoading, error, reload } = useFetch(getEmployees);
  const { data: departments } = useFetch(getDepartments);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [department, setDepartment] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setEmail("");
    setPosition("");
    setSalary("");
    setDepartment("");
    setDateOfJoining("");
    setModalOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setEditing(employee);
    setName(employee.name);
    setEmail(employee.email);
    setPosition(employee.position);
    setSalary(String(employee.salary));
    setDepartment(employee.department._id);
    setDateOfJoining(employee.dateOfJoining.slice(0, 10));
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name,
        email,
        position,
        salary: Number(salary),
        department,
        ...(dateOfJoining ? { dateOfJoining } : {}),
      };
      if (editing) {
        await updateEmployee(editing._id, payload);
        showToast("success", "Employee updated");
      } else {
        await createEmployee(payload);
        showToast("success", "Employee created");
      }
      setModalOpen(false);
      await reload();
    } catch (err) {
      showToast("error", getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteEmployee(deleteTarget._id);
      showToast("success", "Employee deleted");
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      showToast("error", getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Employee>[] = [
    { header: "Name", render: (e) => <span className="font-medium">{e.name}</span> },
    { header: "Email", render: (e) => e.email },
    { header: "Position", render: (e) => e.position },
    { header: "Department", render: (e) => e.department?.name ?? "—" },
    { header: "Salary", render: (e) => e.salary.toLocaleString() },
    ...(isAdmin
      ? [
          {
            header: "Actions",
            render: (e: Employee) => (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => openEdit(e)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => setDeleteTarget(e)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle="Manage employee records"
        action={
          isAdmin ? <Button onClick={openCreate}>Add Employee</Button> : undefined
        }
      />

      {isLoading && <Spinner />}
      {error && <Alert variant="error">{error}</Alert>}
      {!isLoading && !error && employees && (
        <Table
          columns={columns}
          data={employees}
          rowKey={(e) => e._id}
          emptyMessage="No employees yet."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        title={editing ? "Edit Employee" : "Add Employee"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="emp-name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            id="emp-email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="emp-position"
            label="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
          <Input
            id="emp-salary"
            label="Salary"
            type="number"
            min={0}
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
          <Select
            id="emp-department"
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a department
            </option>
            {(departments ?? []).map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </Select>
          <Input
            id="emp-doj"
            label="Date of joining (optional)"
            type="date"
            value={dateOfJoining}
            onChange={(e) => setDateOfJoining(e.target.value)}
          />
          <div className="mt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editing ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Employee"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default EmployeesPage;
