import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useFetch } from "../hooks/useFetch";
import { getErrorMessage } from "../utils/getErrorMessage";
import {
  getLeaves,
  applyLeave,
  updateLeaveStatus,
  deleteLeave,
} from "../api/leave.api";
import { getEmployees } from "../api/employee.api";
import type { Leave, LeaveType } from "../types/hrms.types";
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
import StatusBadge from "../components/ui/StatusBadge";

const LEAVE_TYPES: LeaveType[] = ["sick", "casual", "annual", "unpaid"];

const LeavesPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user?.role === "admin";

  const { data: leaves, isLoading, error, reload } = useFetch(getLeaves);
  const { data: employees } = useFetch(getEmployees);

  const [isModalOpen, setModalOpen] = useState(false);
  const [employee, setEmployee] = useState("");
  const [leaveType, setLeaveType] = useState<LeaveType>("casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Leave | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const openApply = () => {
    setEmployee("");
    setLeaveType("casual");
    setStartDate("");
    setEndDate("");
    setReason("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await applyLeave({
        employee,
        leaveType,
        startDate,
        endDate,
        ...(reason ? { reason } : {}),
      });
      showToast("success", "Leave request submitted");
      setModalOpen(false);
      await reload();
    } catch (err) {
      showToast("error", getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDecision = async (
    leave: Leave,
    status: "approved" | "rejected"
  ) => {
    setUpdatingId(leave._id);
    try {
      await updateLeaveStatus(leave._id, status);
      showToast("success", `Leave ${status}`);
      await reload();
    } catch (err) {
      showToast("error", getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteLeave(deleteTarget._id);
      showToast("success", "Leave request deleted");
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      showToast("error", getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (iso: string) => iso.slice(0, 10);

  const columns: Column<Leave>[] = [
    {
      header: "Employee",
      render: (l) => (
        <span className="font-medium">{l.employee?.name ?? "—"}</span>
      ),
    },
    { header: "Type", render: (l) => <span className="capitalize">{l.leaveType}</span> },
    {
      header: "Dates",
      render: (l) => `${formatDate(l.startDate)} → ${formatDate(l.endDate)}`,
    },
    { header: "Status", render: (l) => <StatusBadge status={l.status} /> },
    ...(isAdmin
      ? [
          {
            header: "Actions",
            render: (l: Leave) => (
              <div className="flex gap-2">
                {l.status === "pending" && (
                  <>
                    <Button
                      variant="primary"
                      isLoading={updatingId === l._id}
                      onClick={() => handleDecision(l, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={updatingId === l._id}
                      onClick={() => handleDecision(l, "rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
                <Button variant="danger" onClick={() => setDeleteTarget(l)}>
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
        title="Leave"
        subtitle="Apply for leave and track approvals"
        action={<Button onClick={openApply}>Apply for Leave</Button>}
      />

      {isLoading && <Spinner />}
      {error && <Alert variant="error">{error}</Alert>}
      {!isLoading && !error && leaves && (
        <Table
          columns={columns}
          data={leaves}
          rowKey={(l) => l._id}
          emptyMessage="No leave requests yet."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        title="Apply for Leave"
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            id="leave-employee"
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
            id="leave-type"
            label="Leave type"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
            required
          >
            {LEAVE_TYPES.map((type) => (
              <option key={type} value={type} className="capitalize">
                {type}
              </option>
            ))}
          </Select>
          <Input
            id="leave-start"
            label="Start date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            id="leave-end"
            label="End date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <Input
            id="leave-reason"
            label="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
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
              Submit request
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Leave Request"
        message="Delete this leave request? This cannot be undone."
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default LeavesPage;
