import api from "@/lib/axios";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";

export interface AuthResponse {
  accessToken: string;
  userId: string;
  email: string;
  role: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  tokenBalance: number;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  university?: string | null;
  avatarUrl?: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export async function loginUser(data: LoginInput): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/api/auth/login", data);
  return res.data;
}

export async function registerUser(data: RegisterInput): Promise<RegisterResponse> {
  const payload = {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    university: data.university ? data.university : undefined,
  };
  const res = await api.post<RegisterResponse>("/api/auth/register", payload);
  return res.data;
}

export async function logoutUser(): Promise<void> {
  await api.post("/api/auth/logout");
}

export async function getCurrentUser(): Promise<UserProfile> {
  const res = await api.get<UserProfile>("/api/users/me");
  return res.data;
}
