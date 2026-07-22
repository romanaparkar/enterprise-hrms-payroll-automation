// Frontend auth types — mirror the shapes the backend returns.

export type UserRole = "admin" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Shape of `data` from POST /auth/login and /auth/register.
export interface AuthResponse {
  token: string;
  user: User;
}
