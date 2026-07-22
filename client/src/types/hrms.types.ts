// Domain types mirroring the backend models.
// On reads, referenced fields arrive populated (full objects).

export interface Department {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  position: string;
  salary: number;
  department: Department; // populated on reads
  dateOfJoining: string;
  createdAt: string;
  updatedAt: string;
}

export type LeaveType = "sick" | "casual" | "annual" | "unpaid";
export type LeaveStatus = "pending" | "approved" | "rejected";

export interface Leave {
  _id: string;
  employee: Employee; // populated on reads
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
  status: LeaveStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Payroll {
  _id: string;
  employee: Employee; // populated on reads
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  createdAt: string;
  updatedAt: string;
}
