// Authentication middleware — proves WHO the caller is.
// Reads the Bearer token, verifies it, and attaches the payload to req.user.
// Any route placed after `protect` requires a valid token.

import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export const protect = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;

  // Expect: "Authorization: Bearer <token>"
  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authenticated. No token provided.");
  }

  const token = header.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Not authenticated. Malformed token.");
  }

  // verifyToken throws on invalid/expired tokens; the error middleware
  // turns that into a 401.
  const payload = verifyToken(token);
  req.user = payload;

  next();
};
