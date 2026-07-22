// Central error handler — the ONE place errors become HTTP responses.
// Mounted LAST in app.ts. Express recognizes it as an error handler
// because it has four parameters (err, req, res, next).

import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Our own business errors (401, 403, 404, 409, ...).
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  const anyErr = err as {
    name?: string;
    code?: number;
    message?: string;
  };

  // Mongoose schema validation (bad email, short password, ...).
  if (anyErr.name === "ValidationError") {
    res.status(400).json({ success: false, message: anyErr.message });
    return;
  }

  // MongoDB duplicate key (e.g. unique email violated).
  if (anyErr.code === 11000) {
    res.status(409).json({
      success: false,
      message: "A record with that value already exists",
    });
    return;
  }

  // Invalid/expired JWT surfaces here as JsonWebTokenError / TokenExpiredError.
  if (
    anyErr.name === "JsonWebTokenError" ||
    anyErr.name === "TokenExpiredError"
  ) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
    return;
  }

  // Anything unexpected — log for the developer, stay generic for the client.
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
  });
};
