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

      {/* ── METRICS OVERVIEW (PLACEHOLDERS) ── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border p-6 flex flex-col justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-muted uppercase">
            Token Balance
          </span>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-ink">100</span>
            <span className="text-xs font-medium text-purple">Tokens</span>
          </div>
          <p className="text-xs text-faint mt-2">Welcome bonus included</p>
        </div>

        <div className="bg-white border border-border p-6 flex flex-col justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-muted uppercase">
            Skills Offered
          </span>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-ink">0</span>
            <span className="text-xs font-medium text-muted">Skills</span>
          </div>
          <p className="text-xs text-faint mt-2">Add skills to earn tokens</p>
        </div>

        <div className="bg-white border border-border p-6 flex flex-col justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-muted uppercase">
            Active Exchanges
          </span>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-ink">0</span>
            <span className="text-xs font-medium text-muted">In progress</span>
          </div>
          <p className="text-xs text-faint mt-2">No pending sessions</p>
        </div>
      </section>

      {/* ── QUICK ACTIONS & RECENT ACTIVITY ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white border border-border p-6 flex flex-col gap-4">
          <h2 className="text-base font-bold text-ink">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard/skills"
              className="p-3 border border-border hover:border-purple transition-colors flex items-center justify-between text-sm group"
            >
              <span className="font-medium text-ink group-hover:text-purple transition-colors">
                Browse Skills Marketplace →
              </span>
              <span className="text-xs text-muted">Explore</span>
            </Link>
            <Link
              href="/dashboard/wallet"
              className="p-3 border border-border hover:border-purple transition-colors flex items-center justify-between text-sm group"
            >
              <span className="font-medium text-ink group-hover:text-purple transition-colors">
                View Wallet & Transactions →
              </span>
              <span className="text-xs text-muted">Wallet</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white border border-border p-6 flex flex-col justify-between">
          <h2 className="text-base font-bold text-ink mb-4">Recent Activity</h2>
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center border border-dashed border-border">
            <p className="text-sm font-medium text-ink">No exchange activity yet</p>
            <p className="text-xs text-muted mt-1 max-w-xs">
              When you trade skills or earn credits, your transactions and requests will appear here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
