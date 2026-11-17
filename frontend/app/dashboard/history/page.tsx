"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2 } from "lucide-react";

interface HistoryRecord {
  id: string;
  skill: string;
  partner: string;
  role: "taught" | "learned";
  tokens: number;
  date: string;
  status: "Completed" | "Pending";
}

const SAMPLE_HISTORY: HistoryRecord[] = [
  {
    id: "tx-1",
    skill: "React & Next.js Fundamentals",
    partner: "Sarah Chen",
    role: "taught",
    tokens: 15,
    date: "Nov 15, 2026",
    status: "Completed",
  },
  {
    id: "tx-2",
    skill: "Linear Algebra & Matrix Ops",
    partner: "David Miller",
    role: "learned",
    tokens: 10,
    date: "Nov 12, 2026",
    status: "Completed",
  },
  {
    id: "tx-3",
    skill: "Figma UI Design Systems",
    partner: "Emma Watson",
    role: "taught",
    tokens: 20,
    date: "Nov 08, 2026",
    status: "Completed",
  },
  {
    id: "tx-4",
    skill: "Python Data Analysis with Pandas",
    partner: "Lucas Garcia",
    role: "learned",
    tokens: 12,
    date: "Nov 02, 2026",
    status: "Completed",
  },
];

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* ── HEADER ── */}
      <section className="bg-white border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-purple/10 text-purple px-2.5 py-1 inline-block mb-3">
            Activity
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Exchange History
          </h1>
          <p className="text-sm text-muted mt-1">
            Review your past learning and teaching sessions and token balances.
          </p>
        </div>

        <div className="flex items-center gap-6 bg-slate-50 border border-border px-5 py-3 rounded">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-muted">
              Total Earned
            </div>
            <div className="text-lg font-bold text-ink">+35 Tokens</div>
          </div>
          <div className="w-[1px] h-8 bg-border" />
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-muted">
              Total Spent
            </div>
            <div className="text-lg font-bold text-ink">22 Tokens</div>
          </div>
        </div>
      </section>

      {/* ── SESSIONS LIST ── */}
      <section className="bg-white border border-border">
        <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
            Past Sessions
          </h2>
          <span className="text-xs text-muted">
            {SAMPLE_HISTORY.length} recorded exchanges
          </span>
        </div>

        <div className="divide-y divide-border">
          {SAMPLE_HISTORY.map((item) => {
            const isEarned = item.role === "taught";
            return (
              <div
                key={item.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isEarned
                        ? "bg-mint/20 text-ink"
                        : "bg-purple/10 text-purple"
                    }`}
                  >
                    {isEarned ? (
                      <ArrowDownLeft className="size-5" />
                    ) : (
                      <ArrowUpRight className="size-5" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-ink">{item.skill}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted mt-1">
                      <span>
                        {isEarned ? "Taught to" : "Learned from"}{" "}
                        <strong className="text-ink font-semibold">
                          {item.partner}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                  <div
                    className={`text-sm font-bold ${
                      isEarned ? "text-emerald-700" : "text-ink"
                    }`}
                  >
                    {isEarned ? `+${item.tokens}` : `-${item.tokens}`} Tokens
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="size-3" />
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
