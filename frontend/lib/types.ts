export type FieldErrors = Record<string, string>;

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  fieldErrors?: FieldErrors;
}

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
  bio?: string | null;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  tokenBalance?: number;
  role: string;
  status: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  price?: number;
}