"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useLoginMutation } from "@/lib/hooks/useAuth";

export default function LoginForm() {
  const { mutate: login, isPending, error } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginInput) {
    login(data);
  }

  const errorMessage = (() => {
    if (!error) return null;
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message ?? "Invalid email or password. Please try again.";
  })();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col">
        <label
          htmlFor="login-email"
          className="text-[11px] font-semibold tracking-wider text-muted mb-1.5 uppercase"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          {...register("email")}
          placeholder="you@university.edu"
          className={`w-full px-3 py-2.5 bg-white border text-sm text-ink placeholder:text-faint outline-none transition-colors ${
            errors.email ? "border-red-500 focus:border-red-500" : "border-border focus:border-purple"
          }`}
        />
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="login-password"
          className="text-[11px] font-semibold tracking-wider text-muted mb-1.5 uppercase"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          placeholder="••••••••"
          className={`w-full px-3 py-2.5 bg-white border text-sm text-ink placeholder:text-faint outline-none transition-colors ${
            errors.password ? "border-red-500 focus:border-red-500" : "border-border focus:border-purple"
          }`}
        />
        {errors.password && (
          <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      {errorMessage && (
        <p className="text-xs text-red-600 font-medium">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 text-sm font-semibold text-white bg-purple hover:bg-[#3d39c0] disabled:bg-faint disabled:cursor-not-allowed transition-colors tracking-tight cursor-pointer"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
