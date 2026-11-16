"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { useRegisterMutation } from "@/lib/hooks/useAuth";

interface RegisterFormProps {
  onSuccessRedirect?: () => void;
}

export default function RegisterForm({ onSuccessRedirect }: RegisterFormProps) {
  const { mutate: registerAccount, isPending, isSuccess, error } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      university: "",
    },
  });

  function onSubmit(data: RegisterInput) {
    registerAccount(data);
  }

  const errorMessage = (() => {
    if (!error) return null;
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message ?? "Registration failed. Please check your details and try again.";
  })();

  if (isSuccess) {
    return (
      <div className="flex flex-col items-start gap-3 py-6 w-full">
        <span className="text-[11px] font-bold uppercase tracking-wider bg-mint text-ink px-2.5 py-1">
          Account created
        </span>
        <p className="text-sm text-muted leading-relaxed">
          Your account has been registered successfully. You can now proceed to sign in.
        </p>
        {onSuccessRedirect && (
          <button
            type="button"
            onClick={onSuccessRedirect}
            className="mt-2 text-xs font-semibold text-purple hover:underline cursor-pointer"
          >
            Go to sign in →
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
      <div className="grid grid-cols-2 gap-3.5">
        <div className="flex flex-col">
          <label
            htmlFor="reg-first-name"
            className="text-[11px] font-semibold tracking-wider text-muted mb-1.5 uppercase"
          >
            First name
          </label>
          <input
            id="reg-first-name"
            type="text"
            autoComplete="given-name"
            {...register("firstName")}
            placeholder="Ada"
            className={`w-full px-3 py-2.5 bg-white border text-sm text-ink placeholder:text-faint outline-none transition-colors ${
              errors.firstName ? "border-red-500 focus:border-red-500" : "border-border focus:border-purple"
            }`}
          />
          {errors.firstName && (
            <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="reg-last-name"
            className="text-[11px] font-semibold tracking-wider text-muted mb-1.5 uppercase"
          >
            Last name
          </label>
          <input
            id="reg-last-name"
            type="text"
            autoComplete="family-name"
            {...register("lastName")}
            placeholder="Lovelace"
            className={`w-full px-3 py-2.5 bg-white border text-sm text-ink placeholder:text-faint outline-none transition-colors ${
              errors.lastName ? "border-red-500 focus:border-red-500" : "border-border focus:border-purple"
            }`}
          />
          {errors.lastName && (
            <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="reg-email"
          className="text-[11px] font-semibold tracking-wider text-muted mb-1.5 uppercase"
        >
          Email
        </label>
        <input
          id="reg-email"
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
          htmlFor="reg-password"
          className="text-[11px] font-semibold tracking-wider text-muted mb-1.5 uppercase"
        >
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          placeholder="Min. 8 characters"
          className={`w-full px-3 py-2.5 bg-white border text-sm text-ink placeholder:text-faint outline-none transition-colors ${
            errors.password ? "border-red-500 focus:border-red-500" : "border-border focus:border-purple"
          }`}
        />
        {errors.password && (
          <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="reg-university"
          className="text-[11px] font-semibold tracking-wider text-muted mb-1.5 uppercase"
        >
          University{" "}
          <span className="text-faint font-normal normal-case">
            (optional)
          </span>
        </label>
        <input
          id="reg-university"
          type="text"
          autoComplete="organization"
          {...register("university")}
          placeholder="e.g. Oxford, Stanford"
          className={`w-full px-3 py-2.5 bg-white border text-sm text-ink placeholder:text-faint outline-none transition-colors ${
            errors.university ? "border-red-500 focus:border-red-500" : "border-border focus:border-purple"
          }`}
        />
        {errors.university && (
          <p className="text-xs text-red-600 mt-1">{errors.university.message}</p>
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
        {isPending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
