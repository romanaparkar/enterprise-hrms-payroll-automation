// Leave HTTP layer.

import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import * as leaveService from "../services/leave.service.js";

// POST /api/leaves  (any authenticated user — apply for leave)
export const apply = asyncHandler(async (req: Request, res: Response) => {
  const { employee, leaveType, startDate, endDate, reason } = req.body ?? {};

  if (!employee || !leaveType || !startDate || !endDate) {
    throw new ApiError(
      400,
      "Employee, leaveType, startDate and endDate are required"
    );
  }

  const leave = await leaveService.applyLeave({
    employee,
    leaveType,
    startDate,
    endDate,
    reason,
  });

  res.status(201).json({
    success: true,
    message: "Leave request submitted successfully",
    data: leave,
  });
});

// GET /api/leaves  (any authenticated user)
export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const leaves = await leaveService.getLeaves();
  res.status(200).json({ success: true, data: leaves });
});

// GET /api/leaves/:id  (any authenticated user)
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const leave = await leaveService.getLeaveById(req.params.id as string);
  res.status(200).json({ success: true, data: leave });
});

// PATCH /api/leaves/:id/status  (admin — approve or reject)
export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body ?? {};

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const leave = await leaveService.updateLeaveStatus(
    req.params.id as string,
    status
  );

  res.status(200).json({
    success: true,
    message: `Leave request ${leave.status}`,
    data: leave,
  });
});

// DELETE /api/leaves/:id  (admin)
export const remove = asyncHandler(async (req: Request, res: Response) => {
  await leaveService.deleteLeave(req.params.id as string);
  res.status(200).json({
    success: true,
    message: "Leave request deleted successfully",
  });
});
