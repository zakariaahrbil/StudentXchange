"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/hooks/useAuthStore";
import { useLogoutMutation } from "@/lib/hooks/useAuth";
import SkillsSection from "@/components/dashboard/SkillsSection";
import { useState } from "react";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.userProfile);
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();
  const [showSkills, setShowSkills] = useState(false);


  const initials = `${user?.firstName?.[0] ?? "S"}${user?.lastName?.[0] ?? "X"}`.toUpperCase();
  const fullName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Student User";
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently joined";


  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink transition-colors"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <section className="bg-white border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-mint text-ink font-bold text-xl sm:text-2xl flex items-center justify-center border-2 border-border shadow-sm">
            {initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-mint text-ink px-2.5 py-0.5">
                Active Student
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {fullName}
            </h1>
            <p className="text-sm text-muted mt-1">
              {user?.university ?? "University student"} • Member since {joinedDate}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-4 py-2 border border-rose-200 hover:border-rose-400 bg-rose-50/30 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isLoggingOut ? "Signing out…" : "Sign out"}
        </button>
      </section>

      <section className="bg-white border border-border p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-muted uppercase">
              Student Exchange Credits
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              {/* TODO: Replace with actual credits from user profile when available */}
              <span className="text-3xl sm:text-4xl font-bold text-ink">100</span>
              <span className="text-sm font-semibold text-purple">Tokens</span>
            </div>
            <p className="text-xs text-faint mt-1">
              Used to book tutoring, peer reviews, and skill exchange sessions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSkills(!showSkills)}
              type="button"
              className={`text-xs font-semibold px-4 py-2 transition-colors cursor-pointer ${
                showSkills
                  ? "bg-[#FAFAFA] text-muted border border-border hover:bg-slate-100 hover:text-ink"
                  : "bg-mint text-ink hover:bg-mint/80"
              }`}
            >
              {showSkills ? "Hide Skills" : "Explore Skills"}
            </button>
          </div>
        </div>
      </section>

      { showSkills &&  <SkillsSection />}

      {/* ── PERSONAL INFORMATION ── */}
      <section className="bg-white border border-border p-6 sm:p-8">
        <div className="border-b border-border pb-4 mb-6">
          <h2 className="text-lg font-bold text-ink">Personal Information</h2>
          <p className="text-xs text-muted mt-1">
            Your university and profile information visible to other students.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              First Name
            </label>
            <div className="px-3.5 py-2.5 bg-[#FAFAFA] border border-border text-sm font-medium text-ink">
              {user?.firstName ?? "—"}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Last Name
            </label>
            <div className="px-3.5 py-2.5 bg-[#FAFAFA] border border-border text-sm font-medium text-ink">
              {user?.lastName ?? "—"}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="px-3.5 py-2.5 bg-[#FAFAFA] border border-border text-sm font-medium text-ink">
              {user?.email ?? "—"}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              University / Institution
            </label>
            <div className="px-3.5 py-2.5 bg-[#FAFAFA] border border-border text-sm font-medium text-ink">
              {user?.university ?? "Not specified"}
            </div>
          </div>
        </div>
      </section>

      {/* ── ACCOUNT STATUS & SETTINGS ── */}
      <section className="bg-white border border-border p-6 sm:p-8">
        <div className="border-b border-border pb-4 mb-6">
          <h2 className="text-lg font-bold text-ink">Account &amp; Security</h2>
          <p className="text-xs text-muted mt-1">
            Account verification and security details.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-b border-border">
          <div>
            <p className="text-sm font-semibold text-ink">Account Status</p>
            <p className="text-xs text-muted mt-0.5">Your student account is verified and in good standing.</p>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
            {user?.status ?? "ACTIVE"}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3">
          <div>
            <p className="text-sm font-semibold text-ink">Role &amp; Permissions</p>
            <p className="text-xs text-muted mt-0.5">Standard student exchange permissions.</p>
          </div>
          <span className="text-xs font-semibold text-muted bg-[#FAFAFA] px-2.5 py-1 border border-border">
            {user?.role ?? "STUDENT"}
          </span>
        </div>
      </section>
    </div>
  );
}
