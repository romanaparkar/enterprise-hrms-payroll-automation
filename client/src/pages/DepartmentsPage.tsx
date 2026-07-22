import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useFetch } from "../hooks/useFetch";
import { getErrorMessage } from "../utils/getErrorMessage";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../api/department.api";
import type { Department } from "../types/hrms.types";
import PageHeader from "../components/layout/PageHeader";
import Table from "../components/ui/Table";
import type { Column } from "../components/ui/Table";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";

const DepartmentsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user?.role === "admin";

  const { data, isLoading, error, reload } = useFetch(getDepartments);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setModalOpen(true);
  };

  const openEdit = (department: Department) => {
    setEditing(department);
    setName(department.name);
    setDescription(department.description ?? "");
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editing) {
        await updateDepartment(editing._id, { name, description });
        showToast("success", "Department updated");
      } else {
        await createDepartment({ name, description });
        showToast("success", "Department created");
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
      await deleteDepartment(deleteTarget._id);
      showToast("success", "Department deleted");
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      showToast("error", getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Department>[] = [
    { header: "Name", render: (d) => <span className="font-medium">{d.name}</span> },
    { header: "Description", render: (d) => d.description || "—" },
    ...(isAdmin
      ? [
          {
            header: "Actions",
            render: (d: Department) => (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => openEdit(d)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => setDeleteTarget(d)}>
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
        title="Departments"
        subtitle="Manage company departments"
        action={
          isAdmin ? <Button onClick={openCreate}>Add Department</Button> : undefined
        }
      />

      {isLoading && <Spinner />}
      {error && <Alert variant="error">{error}</Alert>}
      {!isLoading && !error && data && (
        <Table
          columns={columns}
          data={data}
          rowKey={(d) => d._id}
          emptyMessage="No departments yet."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        title={editing ? "Edit Department" : "Add Department"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="dept-name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            id="dept-description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
        title="Delete Department"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default DepartmentsPage;
