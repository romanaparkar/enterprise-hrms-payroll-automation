// Employee business logic. Enforces the Department relationship:
// an employee cannot reference a department that does not exist.

import Employee, { type IEmployee } from "../models/employee.model.js";
import Department from "../models/department.model.js";
import { ApiError } from "../utils/ApiError.js";

export interface EmployeeInput {
  name: string;
  email: string;
  position: string;
  salary: number;
  department: string; // Department id
  dateOfJoining?: Date;
}

// A ref does not guarantee the target exists — verify it ourselves.
const assertDepartmentExists = async (departmentId: string): Promise<void> => {
  const department = await Department.findById(departmentId);
  if (!department) {
    throw new ApiError(400, "The specified department does not exist");
  }
};

export const createEmployee = async (
  input: EmployeeInput
): Promise<IEmployee> => {
  await assertDepartmentExists(input.department);
  const employee = await Employee.create(input);
  return employee.populate("department");
};

export const getEmployees = async (): Promise<IEmployee[]> => {
  return Employee.find().populate("department").sort({ createdAt: -1 });
};

export const getEmployeeById = async (id: string): Promise<IEmployee> => {
  const employee = await Employee.findById(id).populate("department");
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }
  return employee;
};

export const updateEmployee = async (
  id: string,
  input: Partial<EmployeeInput>
): Promise<IEmployee> => {
  // If the department is being changed, validate the new one exists.
  if (input.department) {
    await assertDepartmentExists(input.department);
  }

  const employee = await Employee.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  }).populate("department");

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }
  return employee;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }
};
