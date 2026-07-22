// Payroll business logic. "Generate" computes netSalary from the employee's
// own salary plus allowances minus deductions — the client never supplies
// the basic salary or the net total.

import Payroll, { type IPayroll } from "../models/payroll.model.js";
import Employee from "../models/employee.model.js";
import { ApiError } from "../utils/ApiError.js";

export interface GeneratePayrollInput {
  employee: string; // Employee id
  month: number;
  year: number;
  allowances?: number;
  deductions?: number;
}

export const generatePayroll = async (
  input: GeneratePayrollInput
): Promise<IPayroll> => {
  const { employee: employeeId, month, year } = input;
  const allowances = input.allowances ?? 0;
  const deductions = input.deductions ?? 0;

  // The basic salary is the employee's authoritative salary — never the client's.
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    throw new ApiError(400, "The specified employee does not exist");
  }

  const basicSalary = employee.salary;
  const netSalary = basicSalary + allowances - deductions;

  const payroll = await Payroll.create({
    employee: employeeId,
    month,
    year,
    basicSalary,
    allowances,
    deductions,
    netSalary,
  });

  return payroll.populate("employee");
};

export const getPayrolls = async (): Promise<IPayroll[]> => {
  return Payroll.find().populate("employee").sort({ year: -1, month: -1 });
};

export const getPayrollById = async (id: string): Promise<IPayroll> => {
  const payroll = await Payroll.findById(id).populate("employee");
  if (!payroll) {
    throw new ApiError(404, "Payroll record not found");
  }
  return payroll;
};

export const deletePayroll = async (id: string): Promise<void> => {
  const payroll = await Payroll.findByIdAndDelete(id);
  if (!payroll) {
    throw new ApiError(404, "Payroll record not found");
  }
};
