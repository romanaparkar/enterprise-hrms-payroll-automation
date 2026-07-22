// Employee HTTP layer. Validate input, delegate to the service, respond.

import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import * as employeeService from "../services/employee.service.js";

// POST /api/employees  (admin)
export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, position, salary, department, dateOfJoining } =
    req.body ?? {};

  if (!name || !email || !position || salary === undefined || !department) {
    throw new ApiError(
      400,
      "Name, email, position, salary and department are required"
    );
  }

  const employee = await employeeService.createEmployee({
    name,
    email,
    position,
    salary,
    department,
    dateOfJoining,
  });

  res.status(201).json({
    success: true,
    message: "Employee created successfully",
    data: employee,
  });
});

// GET /api/employees  (any authenticated user)
export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const employees = await employeeService.getEmployees();
  res.status(200).json({ success: true, data: employees });
});

// GET /api/employees/:id  (any authenticated user)
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const employee = await employeeService.getEmployeeById(
    req.params.id as string
  );
  res.status(200).json({ success: true, data: employee });
});

// PUT /api/employees/:id  (admin)
export const update = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, position, salary, department, dateOfJoining } =
    req.body ?? {};

  const employee = await employeeService.updateEmployee(
    req.params.id as string,
    { name, email, position, salary, department, dateOfJoining }
  );

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    data: employee,
  });
});

// DELETE /api/employees/:id  (admin)
export const remove = asyncHandler(async (req: Request, res: Response) => {
  await employeeService.deleteEmployee(req.params.id as string);
  res.status(200).json({
    success: true,
    message: "Employee deleted successfully",
  });
});
