"use client";

import Link from "next/link";
import {
  Coins,
  CalendarCheck,
  Compass,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
} from "lucide-react";
import { useAuthStore } from "@/lib/hooks/useAuthStore";
import { useLogoutMutation } from "@/lib/hooks/useAuth";
import { useUserBookings } from "@/lib/hooks/useBookings";
import { useGetMySkills } from "@/lib/hooks/useSkills";

export default function DashboardHomePage() {
  const user = useAuthStore((state) => state.userProfile);
  const currentUserId = user?.id ?? "u-current";
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  const { data: bookings = [], isLoading: isLoadingBookings } = useUserBookings();
  const { data: skills = [] } = useGetMySkills();

  // Metrics derived from live bookings
  const pendingRequests = bookings.filter((b) => b.status === "PENDING");
  const activeSessions = bookings.filter((b) => b.status === "ACCEPTED");
  const completedSessions = bookings.filter((b) => b.status === "COMPLETED");

  // Next upcoming scheduled session
  const nextSession = activeSessions[0] ?? pendingRequests[0] ?? null;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
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

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/explore"
            className="inline-flex items-center gap-2 bg-ink text-white px-4 py-2 text-xs font-semibold hover:bg-ink/85 transition-colors cursor-pointer"
          >
            <Compass className="size-3.5" />
            <span>Explore Skills</span>
          </Link>

          <button
            type="button"
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="text-xs font-semibold text-muted hover:text-ink px-3 py-2 border border-border hover:border-ink transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </section>

      {/* ── LIVE STATS OVERVIEW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Token Balance */}
        <div className="bg-white border border-border p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted">
                Wallet Balance
              </span>
              <Coins className="size-4 text-purple" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink mt-2">
              {user?.tokenBalance ?? 100}{" "}
              <span className="text-xs font-semibold text-purple">Tokens</span>
            </div>
            <p className="text-xs text-muted mt-1">Available for campus exchanges</p>
          </div>

          <Link
            href="/dashboard/profile"
            className="mt-4 pt-3 border-t border-border/80 text-xs font-semibold text-ink hover:underline inline-flex items-center gap-1"
          >
            <span>Manage wallet</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {/* Active Sessions */}
        <div className="bg-white border border-border p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted">
                Active Sessions
              </span>
              <Clock className="size-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink mt-2">
              {activeSessions.length}
            </div>
            <p className="text-xs text-muted mt-1">Accepted &amp; in progress</p>
          </div>

          <Link
            href="/dashboard/bookings"
            className="mt-4 pt-3 border-t border-border/80 text-xs font-semibold text-ink hover:underline inline-flex items-center gap-1"
          >
            <span>View bookings</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {/* Pending Requests */}
        <div className="bg-white border border-border p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted">
                Pending Requests
              </span>
              <CalendarCheck className="size-4 text-muted" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-ink mt-2">
              {pendingRequests.length}
            </div>
            <p className="text-xs text-muted mt-1">Awaiting confirmation</p>
          </div>

          <Link
            href="/dashboard/bookings"
            className="mt-4 pt-3 border-t border-border/80 text-xs font-semibold text-ink hover:underline inline-flex items-center gap-1"
          >
            <span>Review requests</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* ── UPCOMING SESSION OR CALLOUT ── */}
      {nextSession ? (
        <section className="bg-white border border-border p-6">
          <div className="flex items-center justify-between mb-3 border-b border-border pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-mint text-ink px-2 py-0.5">
              Next Scheduled Session
            </span>
            <span className="text-xs text-muted font-medium">
              Status: <strong className="text-ink">{nextSession.status}</strong>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-ink">
                {nextSession.skillName}
              </h3>
              <p className="text-xs text-muted mt-1 flex items-center gap-2">
                <span>
                  Scheduled:{" "}
                  <strong className="text-ink">
                    {new Date(nextSession.realizationAt).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </strong>
                </span>
                <span>•</span>
                <span>{nextSession.price} Tokens</span>
              </p>
              {nextSession.description && (
                <p className="text-xs text-muted mt-2 italic bg-[#FAFAFA] p-2 border border-border/60">
                  &ldquo;{nextSession.description}&rdquo;
                </p>
              )}
            </div>

            <Link
              href="/dashboard/bookings"
              className="inline-flex items-center gap-1.5 bg-ink text-white px-4 py-2 text-xs font-semibold hover:bg-ink/85 transition-colors shrink-0"
            >
              <span>Go to Bookings</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </section>
      ) : (
        <section className="bg-white border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-ink">No upcoming sessions</h3>
            <p className="text-xs text-muted mt-1 max-w-md">
              Need help fixing a leak, moving furniture, learning React, or reviewing designs?
              Discover skilled peers across campus ready to help.
            </p>
          </div>

          <Link
            href="/dashboard/explore"
            className="inline-flex items-center gap-2 bg-mint text-ink px-4 py-2 text-xs font-semibold hover:bg-mint/80 transition-colors shrink-0"
          >
            <span>Explore Skills</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </section>
      )}

      {/* ── QUICK ACTION TILES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tile 1: Explore */}
        <Link
          href="/dashboard/explore"
          className="group p-5 bg-white border border-border hover:border-ink transition-colors flex flex-col justify-between gap-4"
        >
          <div>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-ink mb-3 group-hover:bg-mint transition-colors">
              <Compass className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-ink">Explore Marketplace</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Find campus peers for practical repairs, design, homework, and tech mentorship.
            </p>
          </div>
          <span className="text-xs font-semibold text-ink group-hover:underline inline-flex items-center gap-1">
            <span>Find services</span>
            <ArrowRight className="size-3" />
          </span>
        </Link>

        {/* Tile 2: My Offerings */}
        <Link
          href="/dashboard/profile"
          className="group p-5 bg-white border border-border hover:border-ink transition-colors flex flex-col justify-between gap-4"
        >
          <div>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-ink mb-3 group-hover:bg-mint transition-colors">
              <Sparkles className="size-4 text-purple" />
            </div>
            <h3 className="text-sm font-bold text-ink">
              My Offerings ({skills.length})
            </h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Post your tradeable skills and earn exchange tokens by helping students.
            </p>
          </div>
          <span className="text-xs font-semibold text-ink group-hover:underline inline-flex items-center gap-1">
            <span>Manage skills</span>
            <ArrowRight className="size-3" />
          </span>
        </Link>

        {/* Tile 3: Bookings & Activity */}
        <Link
          href="/dashboard/bookings"
          className="group p-5 bg-white border border-border hover:border-ink transition-colors flex flex-col justify-between gap-4"
        >
          <div>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-ink mb-3 group-hover:bg-mint transition-colors">
              <CalendarCheck className="size-4 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-ink">Session Bookings</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Manage incoming peer requests, schedule session dates, and complete services.
            </p>
          </div>
          <span className="text-xs font-semibold text-ink group-hover:underline inline-flex items-center gap-1">
            <span>Open bookings</span>
            <ArrowRight className="size-3" />
          </span>
        </Link>
      </div>
    </div>
  );
}
