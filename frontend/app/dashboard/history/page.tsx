"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { useUserBookings } from "@/lib/hooks/useBookings";
import { useAuthStore } from "@/lib/hooks/useAuthStore";
import type { Booking } from "@/lib/types";

export default function HistoryPage() {
  const user = useAuthStore((state) => state.userProfile);
  const currentUserId = user?.id ?? "";

  const { data: serverBookings = [], isLoading } = useUserBookings();

  const completedBookings = serverBookings.filter((b) => b.status === "COMPLETED");

  // Calculate real totals
  const totalEarned = completedBookings
    .filter((b) => b.skillOwnerId === currentUserId)
    .reduce((acc, curr) => acc + curr.price, 0);

  const totalSpent = completedBookings
    .filter((b) => b.buyerId === currentUserId)
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* ── HEADER ── */}
      <section className="bg-white border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-mint text-ink px-2.5 py-1 inline-block mb-3">
            Activity
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Exchange History
          </h1>
          <p className="text-sm text-muted mt-1">
            Review your past peer services, completed exchanges, and token activity.
          </p>
        </div>

        <div className="flex items-center gap-6 bg-slate-50 border border-border px-5 py-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-muted">
              Total Earned
            </div>
            <div className="text-lg font-bold text-ink">+{totalEarned} Tokens</div>
          </div>
          <div className="w-[1px] h-8 bg-border" />
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-muted">
              Total Spent
            </div>
            <div className="text-lg font-bold text-ink">{totalSpent} Tokens</div>
          </div>
        </div>
      </section>

      {/* ── SESSIONS LIST ── */}
      <section className="bg-white border border-border">
        <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
            Completed Sessions
          </h2>
          <span className="text-xs text-muted">
            {completedBookings.length} completed {completedBookings.length === 1 ? "exchange" : "exchanges"}
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-mint border-t-transparent rounded-full animate-spin" />
          </div>
        ) : completedBookings.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Clock className="size-8 text-muted mb-3" />
            <h3 className="text-base font-bold text-ink">No completed exchanges yet</h3>
            <p className="text-xs text-muted mt-1 max-w-sm">
              When peer sessions are completed and tokens are transferred, they will appear here.
            </p>
            <Link
              href="/dashboard/explore"
              className="mt-6 inline-flex items-center gap-2 bg-mint text-ink text-xs font-semibold px-5 py-2.5 hover:bg-mint/80 transition-colors"
            >
              <span>Explore Skills</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {completedBookings.map((item) => {
              const isEarned = item.skillOwnerId === currentUserId;

              const sessionDate = item.realizationAt || item.createdAt;
              const formattedDate = sessionDate
                ? new Date(sessionDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent";

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-border ${
                        isEarned
                          ? "bg-mint/30 text-ink"
                          : "bg-slate-100 text-ink"
                      }`}
                    >
                      {isEarned ? (
                        <ArrowDownLeft className="size-5" />
                      ) : (
                        <ArrowUpRight className="size-5" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-ink">{item.skillName}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted mt-1">
                        <span>
                          {isEarned ? "Provided to peer" : "Received from peer"}
                        </span>
                        <span>•</span>
                        <span>{formattedDate}</span>
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted mt-1.5 line-clamp-1 italic">
                          &ldquo;{item.description}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                    <div
                      className={`text-sm font-bold ${
                        isEarned ? "text-emerald-700" : "text-ink"
                      }`}
                    >
                      {isEarned ? `+${item.price}` : `-${item.price}`} Tokens
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5">
                      <CheckCircle2 className="size-3" />
                      <span>Completed</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
