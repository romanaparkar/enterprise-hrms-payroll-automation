import { Schema, model, Types, type Document } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  email: string;
  position: string;
  salary: number;
  department: Types.ObjectId; // reference to a Department document
  dateOfJoining: Date;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Employee email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department", // enables .populate("department")
      required: [true, "Department is required"],
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Employee = model<IEmployee>("Employee", employeeSchema);

export default Employee;
