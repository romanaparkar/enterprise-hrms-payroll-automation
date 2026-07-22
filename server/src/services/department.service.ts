// Department business logic. No req/res here — pure CRUD operations.
// A duplicate name is caught by the unique index and surfaces as a 409
// via the central error middleware, so we don't check it manually.

import Department, {
  type IDepartment,
} from "../models/department.model.js";
import { ApiError } from "../utils/ApiError.js";

export interface DepartmentInput {
  name: string;
  description?: string;
}

export const createDepartment = async (
  input: DepartmentInput
): Promise<IDepartment> => {
  return Department.create(input);
};

export const getDepartments = async (): Promise<IDepartment[]> => {
  return Department.find().sort({ createdAt: -1 });
};

export const getDepartmentById = async (
  id: string
): Promise<IDepartment> => {
  const department = await Department.findById(id);
  if (!department) {
    throw new ApiError(404, "Department not found");
  }
  return department;
};

export const updateDepartment = async (
  id: string,
  input: Partial<DepartmentInput>
): Promise<IDepartment> => {
  const department = await Department.findByIdAndUpdate(id, input, {
    new: true, // return the updated document
    runValidators: true, // enforce schema rules on update
  });
  if (!department) {
    throw new ApiError(404, "Department not found");
  }
  return department;
};

export const deleteDepartment = async (id: string): Promise<void> => {
  const department = await Department.findByIdAndDelete(id);
  if (!department) {
    throw new ApiError(404, "Department not found");
  }
};
