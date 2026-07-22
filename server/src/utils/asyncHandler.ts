// Wraps an async Express handler so any rejected promise is forwarded
// to next() — and therefore to the central error middleware.
// Without this, an unhandled async throw would crash the request.

import type { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
