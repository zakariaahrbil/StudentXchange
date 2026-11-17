"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/hooks/useAuthStore";
import { useLogoutMutation } from "@/lib/hooks/useAuth";

export default function DashboardHomePage() {
  const user = useAuthStore((state) => state.userProfile);
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  return (
    <div className="flex flex-col gap-8">
      {/* ── WELCOME BANNER ── */}
      <section className="bg-white border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-mint text-ink px-2.5 py-1 inline-block mb-3">
            Active Student
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Welcome back, {user?.firstName ?? "Student"}!
          </h1>
          <p className="text-sm text-muted mt-1">
            {user?.university ?? "University student"} • {user?.email}
          </p>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="text-xs font-semibold text-muted hover:text-ink px-4 py-2 border border-border hover:border-ink transition-colors cursor-pointer"
        >
          {isLoggingOut ? "Signing out…" : "Sign out"}
        </button>
      </section>

    </div>
  );
}
