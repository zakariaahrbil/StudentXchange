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
import { useRouter } from "next/navigation";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter()

  return useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("accessToken", data.accessToken);
        router.push("/")
      }
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
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

  return useMutation<void, Error, void>({
    mutationFn: logoutUser,
    onSuccess: () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("accessToken");
      }
      queryClient.setQueryData(authKeys.user(), null);
    },
  });
}

export function useCurrentUser() {
  return useQuery<UserProfile, Error>({
    queryKey: authKeys.user(),
    queryFn: getCurrentUser,
    enabled: typeof window !== "undefined" && !!sessionStorage.getItem("accessToken"),
    retry: false,
  });
}
