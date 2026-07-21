import { Schema, model, type Document } from "mongoose";

// The two roles this system supports (Week 1 RBAC).
// Defined here because it describes the shape of a User.
export type UserRole = "admin" | "employee";

// TypeScript's view of a User document.
// Extends Mongoose's Document so instances also carry _id, save(), etc.
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// The runtime blueprint Mongoose enforces on every write.
export const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned by queries unless explicitly requested
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee", // least privilege by default
    },
  },
  {
    timestamps: true, // auto-manage createdAt / updatedAt
  }
);

const User = model<IUser>("User", userSchema);

export default User;
