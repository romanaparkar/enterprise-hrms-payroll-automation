import api from "./axiosClient";
import type { Leave, LeaveType, LeaveStatus } from "../types/hrms.types";

export interface ApplyLeavePayload {
  employee: string; // Employee id
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export const getLeaves = async (): Promise<Leave[]> => {
  const res = await api.get("/leaves");
  return res.data.data;
};

export const applyLeave = async (
  payload: ApplyLeavePayload
): Promise<Leave> => {
  const res = await api.post("/leaves", payload);
  return res.data.data;
};

export const updateLeaveStatus = async (
  id: string,
  status: Extract<LeaveStatus, "approved" | "rejected">
): Promise<Leave> => {
  const res = await api.patch(`/leaves/${id}/status`, { status });
  return res.data.data;
};

export const deleteLeave = async (id: string): Promise<void> => {
  await api.delete(`/leaves/${id}`);
};
