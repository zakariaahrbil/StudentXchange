"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  type AuthResponse,
  type RegisterResponse,
  type UserProfile,
  type UpdateProfilePayload,
} from "@/lib/api/auth";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";
import { useAuthStore } from "@/lib/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/lib/queryKeys";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      useAuthStore.getState().setAccessToken(data.accessToken);
      try {
        const profile = await getCurrentUser();
        setAuth(profile, data.accessToken);
      } catch (err) {
        console.error("Failed to load user profile on login:", err);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      router.push("/dashboard");
    },
  });
}

export function useRegisterMutation() {
  return useMutation<RegisterResponse, Error, RegisterInput>({
    mutationFn: registerUser,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const signOut = useAuthStore((state) => state.signOut);

  return useMutation<void, Error, void>({
    mutationFn: logoutUser,
    onSuccess: () => {
      signOut();
      queryClient.setQueryData(queryKeys.auth.user(), null);
    },
  });
}

export function useCurrentUser() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);

  return useQuery<UserProfile, Error>({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      const profile = await getCurrentUser();
      if (accessToken) {
        setAuth(profile, accessToken);
      }
      return profile;
    },
    enabled: !!accessToken,
    retry: false,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  return useMutation<UserProfile, Error, UpdateProfilePayload>({
    mutationKey: ["updateProfile"],
    mutationFn: updateUserProfile,
    onSuccess: (updatedProfile) => {
      setUserProfile(updatedProfile);
      queryClient.setQueryData(queryKeys.auth.user(), updatedProfile);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
  });
}
