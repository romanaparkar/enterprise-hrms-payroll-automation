// Auth HTTP layer — thin. Reads the request, calls the service,
// shapes the HTTP response. No business logic lives here.

import type { Request, Response } from "express";
import { registerUser } from "../services/auth.service.js";

/**
 * POST /api/auth/register
 * Body: { name, email, password, role? }
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body ?? {};

    // Presence validation — fast, before we touch the database.
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
      return;
    }

    const user = await registerUser({ name, email, password, role });

    // 201 Created. Note: password is absent because the schema uses
    // select: false, so it is never part of the returned document.
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const err = error as Error & { statusCode?: number };

    // Known business error (e.g. duplicate email → 409).
    if (err.statusCode) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
      return;
    }

    // Mongoose schema validation error (e.g. bad email format, short password).
    if (err.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: err.message,
      });
      return;
    }

    // Anything unexpected → 500, and log it for the developer.
    console.error("Register error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
