import { Schema, model, Types, type Document } from "mongoose";

export interface IPayroll extends Document {
  employee: Types.ObjectId; // reference to an Employee document
  month: number; // 1-12
  year: number;
  basicSalary: number; // copied from the employee at generation time
  allowances: number;
  deductions: number;
  netSalary: number; // computed = basicSalary + allowances - deductions
  createdAt: Date;
  updatedAt: Date;
}

const payrollSchema = new Schema<IPayroll>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee is required"],
    },
    month: {
      type: Number,
      required: [true, "Month is required"],
      min: [1, "Month must be between 1 and 12"],
      max: [12, "Month must be between 1 and 12"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    basicSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    allowances: {
      type: Number,
      default: 0,
      min: 0,
    },
    deductions: {
      type: Number,
      default: 0,
      min: 0,
    },
    netSalary: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// One payroll per employee per month/year. A repeat attempt is rejected
// as a duplicate (409) by the central error middleware.
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

const Payroll = model<IPayroll>("Payroll", payrollSchema);

export default Payroll;
