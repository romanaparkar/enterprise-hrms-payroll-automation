// Shared auth types.

import type { UserRole } from "../models/user.model.js";

// What we store inside every JWT. Kept minimal — no secrets.
export interface JwtPayload {
  userId: string;
  role: UserRole;
}

// Declaration merging: teach TypeScript that Express requests may carry
// a `user` (set by the auth middleware after verifying the token).
// This makes req.user typed everywhere, with no `any`.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
