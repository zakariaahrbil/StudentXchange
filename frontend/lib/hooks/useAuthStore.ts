import { create } from "zustand";
import { UserProfile } from "../api/auth";

export interface AuthState {
  userProfile: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (userProfile: UserProfile, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userProfile: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  setAuth: (userProfile: UserProfile, accessToken: string) =>
    set({
      userProfile,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    }),

  setAccessToken: (accessToken: string) =>
    set({
      accessToken,
      isAuthenticated: true,
    }),

  setLoading: (loading: boolean) =>
    set({
      isLoading: loading,
    }),

  signOut: () =>
    set({
      userProfile: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));