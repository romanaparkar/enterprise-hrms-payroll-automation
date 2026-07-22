// Authorization middleware — proves the caller is ALLOWED to do this.
// Must run AFTER `protect`, which sets req.user from the verified token.
//
// Usage on a route:
//   router.delete("/:id", protect, authorize("admin"), controller)
//
// `authorize` is a factory: you call it with the allowed roles, and it
// returns a middleware that enforces them. One reusable rule for any
// combination of roles.

import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const authorize =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    // Defensive: authorize must be placed after protect.
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to perform this action");
    }

    next();
  };
