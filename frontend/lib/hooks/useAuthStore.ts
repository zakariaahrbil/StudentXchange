import { create } from "zustand";
import type { UserProfile } from "@/lib/types";

export interface AuthState {
  userProfile: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (userProfile: UserProfile, accessToken: string) => void;
  setUserProfile: (userProfile: UserProfile) => void;
  setAccessToken: (accessToken: string) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userProfile: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (userProfile: UserProfile, accessToken: string) =>
    set({
      userProfile,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    }),

  setUserProfile: (userProfile: UserProfile) =>
    set({
      userProfile,
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