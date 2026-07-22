// Auth HTTP layer — thin. Reads the request, calls the service, shapes the
// response. Wrapped in asyncHandler, so thrown errors go to the error
// middleware; no try/catch needed here.

import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { registerUser, loginUser } from "../services/auth.service.js";
import User from "../models/user.model.js";

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  const { user, token } = await registerUser({ name, email, password });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const { user, token } = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

/**
 * GET /api/auth/me  (protected)
 * Returns the currently authenticated user. Demonstrates the protect
 * middleware: req.user is populated from the verified token.
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // protect guarantees req.user exists by the time we get here.
  const user = await User.findById(req.user!.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
