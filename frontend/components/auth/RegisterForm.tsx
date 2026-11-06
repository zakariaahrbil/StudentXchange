"use client";

import { useState } from "react";

interface RegisterFormProps {
  onSuccessRedirect?: () => void;
}

export default function RegisterForm({ onSuccessRedirect }: RegisterFormProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    university: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          university: form.university.trim() || undefined,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "Registration failed. Please verify your details.");
      }
    } catch {
      setError("Unable to connect to the backend server. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
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
            required
            maxLength={255}
            value={form.firstName}
            onChange={handleChange("firstName")}
            placeholder="Ada"
            className="w-full px-3 py-2.5 bg-white border border-border text-sm text-ink placeholder:text-faint outline-none focus:border-purple transition-colors"
          />
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
            required
            maxLength={255}
            value={form.lastName}
            onChange={handleChange("lastName")}
            placeholder="Lovelace"
            className="w-full px-3 py-2.5 bg-white border border-border text-sm text-ink placeholder:text-faint outline-none focus:border-purple transition-colors"
          />
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
          required
          maxLength={255}
          value={form.email}
          onChange={handleChange("email")}
          placeholder="you@university.edu"
          className="w-full px-3 py-2.5 bg-white border border-border text-sm text-ink placeholder:text-faint outline-none focus:border-purple transition-colors"
        />
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
          required
          minLength={8}
          maxLength={72}
          value={form.password}
          onChange={handleChange("password")}
          placeholder="Min. 8 characters"
          className="w-full px-3 py-2.5 bg-white border border-border text-sm text-ink placeholder:text-faint outline-none focus:border-purple transition-colors"
        />
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
          maxLength={255}
          value={form.university}
          onChange={handleChange("university")}
          placeholder="e.g. Oxford, Stanford"
          className="w-full px-3 py-2.5 bg-white border border-border text-sm text-ink placeholder:text-faint outline-none focus:border-purple transition-colors"
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 font-medium">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 text-sm font-semibold text-white bg-purple hover:bg-[#3d39c0] disabled:bg-faint disabled:cursor-not-allowed transition-colors tracking-tight cursor-pointer"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
