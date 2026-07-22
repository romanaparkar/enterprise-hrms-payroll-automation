// Payroll HTTP layer. All routes are admin-only (financial data).

import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import * as payrollService from "../services/payroll.service.js";

// POST /api/payrolls  (admin — generate)
export const generate = asyncHandler(async (req: Request, res: Response) => {
  const { employee, month, year, allowances, deductions } = req.body ?? {};

  if (!employee || month === undefined || year === undefined) {
    throw new ApiError(400, "Employee, month and year are required");
  }

  const payroll = await payrollService.generatePayroll({
    employee,
    month,
    year,
    allowances,
    deductions,
  });

  res.status(201).json({
    success: true,
    message: "Payroll generated successfully",
    data: payroll,
  });
});

// GET /api/payrolls  (admin — view all)
export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const payrolls = await payrollService.getPayrolls();
  res.status(200).json({ success: true, data: payrolls });
});

// GET /api/payrolls/:id  (admin — view one)
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const payroll = await payrollService.getPayrollById(req.params.id as string);
  res.status(200).json({ success: true, data: payroll });
});

// DELETE /api/payrolls/:id  (admin)
export const remove = asyncHandler(async (req: Request, res: Response) => {
  await payrollService.deletePayroll(req.params.id as string);
  res.status(200).json({
    success: true,
    message: "Payroll record deleted successfully",
  });
});
