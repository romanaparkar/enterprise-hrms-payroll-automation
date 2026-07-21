import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";

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

export default app;
