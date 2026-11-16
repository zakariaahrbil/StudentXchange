"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  type AuthResponse,
  type RegisterResponse,
  type UserProfile,
} from "@/lib/api/auth";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";
import { useAuthStore } from "@/lib/hooks/useAuthStore";
import { useRouter } from "next/navigation";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      router.push("/");
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
      queryClient.setQueryData(authKeys.user(), null);
    },
  });
}

export function useCurrentUser() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);

  return useQuery<UserProfile, Error>({
    queryKey: authKeys.user(),
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
