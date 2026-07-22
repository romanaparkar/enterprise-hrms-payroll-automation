import api from "./axiosClient";
import type { Employee } from "../types/hrms.types";

export interface EmployeePayload {
  name: string;
  email: string;
  position: string;
  salary: number;
  department: string; // Department id
  dateOfJoining?: string;
}

export const getEmployees = async (): Promise<Employee[]> => {
  const res = await api.get("/employees");
  return res.data.data;
};

export const createEmployee = async (
  payload: EmployeePayload
): Promise<Employee> => {
  const res = await api.post("/employees", payload);
  return res.data.data;
};

export const updateEmployee = async (
  id: string,
  payload: EmployeePayload
): Promise<Employee> => {
  const res = await api.put(`/employees/${id}`, payload);
  return res.data.data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await api.delete(`/employees/${id}`);
};
