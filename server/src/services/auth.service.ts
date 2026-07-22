// Auth business logic — NO req/res here.
// This layer knows the rules (duplicate emails, hashing, credential checks,
// token issuing); it does not know it is being called over HTTP.

import bcrypt from "bcrypt";
import User, { type IUser, type UserRole } from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole; // ignored by public registration; see note below
}

export interface LoginInput {
  email: string;
  password: string;
}

// What the service returns to the controller after auth succeeds.
export interface AuthResult {
  user: IUser;
  token: string;
}

const SALT_ROUNDS = 10;

// Build a signed JWT from a user document. Only id + role go in the token.
const issueToken = (user: IUser): string =>
  signToken({ userId: String(user._id), role: user.role });

/**
 * Register a new user, then issue a token so the client is logged in
 * immediately after signing up.
 */
export const registerUser = async (input: RegisterInput): Promise<AuthResult> => {
  // `role` is intentionally ignored — this is a PUBLIC endpoint, so we never
  // let a client choose its own role (privilege escalation). The schema
  // default "employee" applies.
  const { name, email, password } = input;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return { user, token: issueToken(user) };
};

/**
 * Verify credentials and issue a token.
 * The SAME 401 message is used for unknown email and wrong password so we
 * never reveal which emails have accounts (user enumeration).
 */
export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  const { email, password } = input;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  return { user, token: issueToken(user) };
};
