"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Placeholder until backend provides /api/auth/login
      await new Promise((resolve) => setTimeout(resolve, 600));
      setError("Login endpoint not yet implemented on the backend.");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
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
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@university.edu"
          className="w-full px-3 py-2.5 bg-white border border-border text-sm text-ink placeholder:text-faint outline-none focus:border-purple transition-colors"
        />
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
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
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
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
