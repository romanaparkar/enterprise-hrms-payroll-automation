import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import "./types/auth.types.js"; // loads the Express Request augmentation

const app = express();

// Middleware
app.use(
  cors({
    origin: env.clientUrl
  })
);

app.use(express.json());

// Health Check Route
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "HRMS API is running 🚀",
  });
});

// Feature Routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payrolls", payrollRoutes);

// Central error handler — MUST be mounted last, after all routes.
app.use(errorHandler);

export default app;
