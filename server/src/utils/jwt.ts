// JWT helpers — small, pure wrappers around jsonwebtoken so the token
// config lives in exactly one place.

import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { JwtPayload } from "../types/auth.types.js";

// Create a signed token from our payload.
export const signToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.jwtSecret, options);
};

// Verify a token's signature and return its payload.
// Throws if the token is invalid or expired — callers handle that.
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
