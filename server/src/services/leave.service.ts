// Leave business logic — a small workflow: apply (pending) → approve/reject.

import Leave, {
  type ILeave,
  type LeaveType,
  type LeaveStatus,
} from "../models/leave.model.js";
import Employee from "../models/employee.model.js";
import { ApiError } from "../utils/ApiError.js";

export interface ApplyLeaveInput {
  employee: string; // Employee id
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  reason?: string;
}

const assertEmployeeExists = async (employeeId: string): Promise<void> => {
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    throw new ApiError(400, "The specified employee does not exist");
  }
};

export const applyLeave = async (input: ApplyLeaveInput): Promise<ILeave> => {
  await assertEmployeeExists(input.employee);

  // Basic date sanity: end cannot be before start.
  if (new Date(input.endDate) < new Date(input.startDate)) {
    throw new ApiError(400, "End date cannot be before start date");
  }

  const leave = await Leave.create(input); // status defaults to "pending"
  return leave.populate("employee");
};

export const getLeaves = async (): Promise<ILeave[]> => {
  return Leave.find().populate("employee").sort({ createdAt: -1 });
};

export const getLeaveById = async (id: string): Promise<ILeave> => {
  const leave = await Leave.findById(id).populate("employee");
  if (!leave) {
    throw new ApiError(404, "Leave request not found");
  }
  return leave;
};

// The workflow transition. Only "approved" or "rejected" are valid targets;
// you cannot move a request back to "pending".
export const updateLeaveStatus = async (
  id: string,
  status: LeaveStatus
): Promise<ILeave> => {
  if (status !== "approved" && status !== "rejected") {
    throw new ApiError(400, "Status must be either 'approved' or 'rejected'");
  }

  const leave = await Leave.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).populate("employee");

  if (!leave) {
    throw new ApiError(404, "Leave request not found");
  }
  return leave;
};

export const deleteLeave = async (id: string): Promise<void> => {
  const leave = await Leave.findByIdAndDelete(id);
  if (!leave) {
    throw new ApiError(404, "Leave request not found");
  }
};
