// Auth business logic — NO req/res here.
// This layer knows the rules (duplicate emails, hashing); it does not
// know it is being called over HTTP.

import bcrypt from "bcrypt";
import User, { type IUser, type UserRole } from "../models/user.model.js";

// The data the register flow needs from the caller.
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole; // optional; model defaults to "employee"
}

// How many rounds bcrypt uses. Higher = slower = harder to brute-force.
// 10 is a sensible, widely-used default for development.
const SALT_ROUNDS = 10;

/**
 * Register a new user.
 * Throws an Error with a `.statusCode` when a rule is violated,
 * so the controller can map it to the right HTTP response.
 */
export const registerUser = async (input: RegisterInput): Promise<IUser> => {
  // NOTE: `role` is intentionally NOT destructured or used here.
  // This is a PUBLIC endpoint — trusting a client-supplied role would let
  // anyone create an admin (privilege escalation). We ignore it and let the
  // schema assign the default "employee". Admin creation happens elsewhere.
  const { name, email, password } = input;

  // 1. Duplicate email check — email is normalized to lowercase in the schema,
  //    so we compare against the lowercased value here too.
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const error = new Error("A user with this email already exists");
    (error as Error & { statusCode?: number }).statusCode = 409;
    throw error;
  }

  // 2. Hash the password. We never store the plain text.
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Persist. Mongoose validates against the schema before writing.
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};
