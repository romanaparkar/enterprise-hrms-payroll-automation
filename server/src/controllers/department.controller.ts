// Department HTTP layer — validate input, delegate to the service,
// shape the response. Wrapped in asyncHandler; errors flow to the
// central error middleware.

import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import * as departmentService from "../services/department.service.js";

// POST /api/departments  (admin)
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body ?? {};

  if (!name) {
    throw new ApiError(400, "Department name is required");
  }

  const department = await departmentService.createDepartment({
    name,
    description,
  });

  res.status(201).json({
    success: true,
    message: "Department created successfully",
    data: department,
  });
});

// GET /api/departments  (any authenticated user)
export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const departments = await departmentService.getDepartments();
  res.status(200).json({ success: true, data: departments });
});

// GET /api/departments/:id  (any authenticated user)
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const department = await departmentService.getDepartmentById(
    req.params.id as string
  );
  res.status(200).json({ success: true, data: department });
});

// PUT /api/departments/:id  (admin)
export const update = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body ?? {};
  const department = await departmentService.updateDepartment(
    req.params.id as string,
    { name, description }
  );
  res.status(200).json({
    success: true,
    message: "Department updated successfully",
    data: department,
  });
});

// DELETE /api/departments/:id  (admin)
export const remove = asyncHandler(async (req: Request, res: Response) => {
  await departmentService.deleteDepartment(req.params.id as string);
  res.status(200).json({
    success: true,
    message: "Department deleted successfully",
  });
});
