import api from "./axiosClient";
import type { Department } from "../types/hrms.types";

export interface DepartmentPayload {
  name: string;
  description?: string;
}

export const getDepartments = async (): Promise<Department[]> => {
  const res = await api.get("/departments");
  return res.data.data;
};

export const createDepartment = async (
  payload: DepartmentPayload
): Promise<Department> => {
  const res = await api.post("/departments", payload);
  return res.data.data;
};

export const updateDepartment = async (
  id: string,
  payload: DepartmentPayload
): Promise<Department> => {
  const res = await api.put(`/departments/${id}`, payload);
  return res.data.data;
};

export const deleteDepartment = async (id: string): Promise<void> => {
  await api.delete(`/departments/${id}`);
};
