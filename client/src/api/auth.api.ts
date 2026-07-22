// Auth API layer — all /auth HTTP calls live here.
// Components/context call these functions, never axios directly.

import api from "./axiosClient";
import type { AuthResponse, User } from "../types/auth.types";

export const loginRequest = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", { email, password });
  return res.data.data;
};

export const registerRequest = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", { name, email, password });
  return res.data.data;
};

export const getMeRequest = async (): Promise<User> => {
  const res = await api.get("/auth/me");
  return res.data.data;
};
