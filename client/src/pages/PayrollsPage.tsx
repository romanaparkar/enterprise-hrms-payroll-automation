import { useState } from "react";
import type { FormEvent } from "react";
import { useToast } from "../hooks/useToast";
import { useFetch } from "../hooks/useFetch";
import { getErrorMessage } from "../utils/getErrorMessage";
import {
  getPayrolls,
  generatePayroll,
  deletePayroll,
} from "../api/payroll.api";
import { getEmployees } from "../api/employee.api";
import type { Payroll } from "../types/hrms.types";
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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PayrollsPage = () => {
  const { showToast } = useToast();

  const { data: payrolls, isLoading, error, reload } = useFetch(getPayrolls);
  const { data: employees } = useFetch(getEmployees);

  const currentYear = 2026; // avoids Date.now(); admin can edit the field

  const [isModalOpen, setModalOpen] = useState(false);
  const [employee, setEmployee] = useState("");
  const [month, setMonth] = useState("1");
  const [year, setYear] = useState(String(currentYear));
  const [allowances, setAllowances] = useState("0");
  const [deductions, setDeductions] = useState("0");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Payroll | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openGenerate = () => {
    setEmployee("");
    setMonth("1");
    setYear(String(currentYear));
    setAllowances("0");
    setDeductions("0");
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await generatePayroll({
        employee,
        month: Number(month),
        year: Number(year),
        allowances: Number(allowances),
        deductions: Number(deductions),
      });
      showToast("success", "Payroll generated");
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
      await deletePayroll(deleteTarget._id);
      showToast("success", "Payroll deleted");
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      showToast("error", getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const monthName = (m: number) => MONTHS[m - 1] ?? String(m);

  const columns: Column<Payroll>[] = [
    {
      header: "Employee",
      render: (p) => (
        <span className="font-medium">{p.employee?.name ?? "—"}</span>
      ),
    },
    { header: "Period", render: (p) => `${monthName(p.month)} ${p.year}` },
    { header: "Basic", render: (p) => p.basicSalary.toLocaleString() },
    { header: "Allowances", render: (p) => p.allowances.toLocaleString() },
    { header: "Deductions", render: (p) => p.deductions.toLocaleString() },
    {
      header: "Net Salary",
      render: (p) => (
        <span className="font-semibold text-slate-800">
          {p.netSalary.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (p) => (
        <Button variant="danger" onClick={() => setDeleteTarget(p)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payroll"
        subtitle="Generate and view employee payslips"
        action={<Button onClick={openGenerate}>Generate Payroll</Button>}
      />

      {isLoading && <Spinner />}
      {error && <Alert variant="error">{error}</Alert>}
      {!isLoading && !error && payrolls && (
        <Table
          columns={columns}
          data={payrolls}
          rowKey={(p) => p._id}
          emptyMessage="No payroll records yet."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        title="Generate Payroll"
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            id="pay-employee"
            label="Employee"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            required
          >
            <option value="" disabled>
              Select an employee
            </option>
            {(employees ?? []).map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </Select>
          <Select
            id="pay-month"
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          >
            {MONTHS.map((label, index) => (
              <option key={label} value={index + 1}>
                {label}
              </option>
            ))}
          </Select>
          <Input
            id="pay-year"
            label="Year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <Input
            id="pay-allowances"
            label="Allowances"
            type="number"
            min={0}
            value={allowances}
            onChange={(e) => setAllowances(e.target.value)}
          />
          <Input
            id="pay-deductions"
            label="Deductions"
            type="number"
            min={0}
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
          />
          <p className="text-xs text-slate-400">
            Basic salary and net pay are computed by the server from the
            employee&apos;s record.
          </p>
          <div className="mt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Generate
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Payroll"
        message="Delete this payroll record? This cannot be undone."
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default PayrollsPage;
