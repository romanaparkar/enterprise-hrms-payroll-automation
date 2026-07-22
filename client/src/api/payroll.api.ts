import api from "./axiosClient";
import type { Payroll } from "../types/hrms.types";

export interface GeneratePayrollPayload {
  employee: string; // Employee id
  month: number;
  year: number;
  allowances?: number;
  deductions?: number;
}

export const getPayrolls = async (): Promise<Payroll[]> => {
  const res = await api.get("/payrolls");
  return res.data.data;
};

export const generatePayroll = async (
  payload: GeneratePayrollPayload
): Promise<Payroll> => {
  const res = await api.post("/payrolls", payload);
  return res.data.data;
};

export const deletePayroll = async (id: string): Promise<void> => {
  await api.delete(`/payrolls/${id}`);
};
