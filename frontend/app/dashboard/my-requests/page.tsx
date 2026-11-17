"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  Plus,
} from "lucide-react";

interface RequestItem {
  id: string;
  type: "demand" | "created_request";
  title: string;
  partner?: string;
  tokens: number;
  date: string;
  status: "in_progress" | "open" | "cancelled" | "completed";
  offersCount?: number;
  step: 1 | 2 | 3;
}

const INITIAL_ITEMS: RequestItem[] = [
  {
    id: "dem-1",
    type: "demand",
    title: "Full-Stack React & Next.js Architecture Mentoring",
    partner: "Alex Rivera",
    tokens: 15,
    date: "Scheduled for Nov 19, 2026",
    status: "in_progress",
    step: 2,
  },
  {
    id: "req-1",
    type: "created_request",
    title: "Need help preparing for Calculus II Midterm (Integration)",
    tokens: 10,
    date: "Posted 2 hours ago",
    status: "open",
    offersCount: 2,
    step: 1,
  },
  {
    id: "dem-2",
    type: "demand",
    title: "UI/UX Wireframing & Prototyping in Figma",
    partner: "Elena Rostova",
    tokens: 20,
    date: "Scheduled for Nov 21, 2026",
    status: "in_progress",
    step: 2,
  },
];

export default function MyRequestsPage() {
  const [items, setItems] = useState<RequestItem[]>(INITIAL_ITEMS);
  const [filter, setFilter] = useState<"all" | "in_progress" | "open">("all");
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);

  const handleCancel = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "cancelled", offersCount: 0 } : item
      )
    );
    setCancelModalId(null);
  };

  const handleMarkCompleted = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "completed", step: 3 } : item
      )
    );
  };

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const activeDemandsCount = items.filter((i) => i.status === "in_progress").length;
  const openRequestsCount = items.filter((i) => i.status === "open").length;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* ── HEADER ── */}
      <section className="bg-white border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-mint text-ink px-2.5 py-1 inline-block mb-3">
            Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            My Demands &amp; Requests
          </h1>
          <p className="text-sm text-muted mt-1">
            Track your approved exchange sessions, monitor progress, and manage your open requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/requests/new"
            className="inline-flex items-center gap-2 bg-ink text-white px-4 py-2.5 text-xs font-semibold hover:bg-ink/85 transition-colors"
          >
            <Plus className="size-4" />
            <span>New Request</span>
          </Link>
        </div>
      </section>

      {/* ── STATS SUMMARY ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border p-5">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted">
            Approved &amp; In Progress
          </div>
          <div className="text-2xl font-bold text-ink mt-1">
            {activeDemandsCount}
          </div>
          <p className="text-xs text-muted mt-1">Sessions actively scheduled</p>
        </div>

        <div className="bg-white border border-border p-5">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted">
            Open Requests
          </div>
          <div className="text-2xl font-bold text-ink mt-1">
            {openRequestsCount}
          </div>
          <p className="text-xs text-muted mt-1">Waiting for tutors or matches</p>
        </div>

        <div className="bg-white border border-border p-5">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted">
            Tokens in Escrow
          </div>
          <div className="text-2xl font-bold text-purple mt-1">
            {items
              .filter((i) => i.status === "in_progress" || i.status === "open")
              .reduce((acc, curr) => acc + curr.tokens, 0)}{" "}
            Tokens
          </div>
          <p className="text-xs text-muted mt-1">Protected until completion</p>
        </div>
      </div>

      {/* ── FILTER TABS ── */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
            filter === "all"
              ? "bg-ink text-white"
              : "text-muted hover:text-ink hover:bg-slate-100"
          }`}
        >
          All Activity ({items.length})
        </button>
        <button
          onClick={() => setFilter("in_progress")}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
            filter === "in_progress"
              ? "bg-ink text-white"
              : "text-muted hover:text-ink hover:bg-slate-100"
          }`}
        >
          Approved Demands ({activeDemandsCount})
        </button>
        <button
          onClick={() => setFilter("open")}
          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
            filter === "open"
              ? "bg-ink text-white"
              : "text-muted hover:text-ink hover:bg-slate-100"
          }`}
        >
          Open Requests ({openRequestsCount})
        </button>
      </div>

      {/* ── LIST OF ITEMS ── */}
      <div className="flex flex-col gap-4">
        {filteredItems.map((item) => {
          const isCancelled = item.status === "cancelled";
          const isCompleted = item.status === "completed";
          const isInProgress = item.status === "in_progress";
          const isOpen = item.status === "open";

          return (
            <div
              key={item.id}
              className={`bg-white border p-6 transition-all ${
                isCancelled
                  ? "border-border/60 opacity-60 bg-slate-50"
                  : "border-border hover:border-border/80"
              }`}
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      item.type === "demand"
                        ? "bg-purple/10 text-purple border border-purple/20"
                        : "bg-slate-100 text-ink border border-border"
                    }`}
                  >
                    {item.type === "demand" ? "Approved Demand" : "Created Request"}
                  </span>

                  {isInProgress && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <Clock className="size-3" />
                      In Progress
                    </span>
                  )}

                  {isOpen && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      <Clock className="size-3" />
                      Open ({item.offersCount} offers)
                    </span>
                  )}

                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="size-3" />
                      Completed
                    </span>
                  )}

                  {isCancelled && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      <XCircle className="size-3" />
                      Cancelled &amp; Refunded
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-ink bg-slate-100 px-3 py-1 rounded w-fit">
                  {item.tokens} Tokens Escrowed
                </div>
              </div>

              {/* Title & metadata */}
              <h2 className="text-base sm:text-lg font-bold text-ink">
                {item.title}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted mt-2">
                {item.partner && (
                  <span>
                    Partner: <strong className="text-ink">{item.partner}</strong>
                  </span>
                )}
                <span>{item.date}</span>
              </div>

              {/* Progress step bar (for demands & open requests) */}
              {!isCancelled && (
                <div className="mt-5 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted mb-2">
                    <span className={item.step >= 1 ? "text-ink font-bold" : ""}>
                      1. Posted
                    </span>
                    <span className={item.step >= 2 ? "text-ink font-bold" : ""}>
                      2. Matched &amp; In Progress
                    </span>
                    <span className={item.step >= 3 ? "text-ink font-bold" : ""}>
                      3. Completed
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-300 ${
                        item.step === 1
                          ? "w-1/3 bg-amber-400"
                          : item.step === 2
                          ? "w-2/3 bg-mint"
                          : "w-full bg-emerald-500"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Actions row */}
              <div className="mt-5 flex flex-wrap items-center justify-end gap-3 pt-3">
                {isOpen && (
                  <button
                    onClick={() => setCancelModalId(item.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded transition-colors cursor-pointer"
                  >
                    Cancel Request &amp; Refund
                  </button>
                )}

                {isInProgress && (
                  <>
                    <button
                      onClick={() => handleMarkCompleted(item.id)}
                      className="text-xs font-semibold bg-mint text-ink hover:bg-mint/80 px-4 py-2 transition-colors cursor-pointer"
                    >
                      Mark Completed &amp; Release Tokens
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="bg-white border border-border p-12 text-center flex flex-col items-center justify-center">
            <ClipboardList className="size-8 text-muted mb-3" />
            <h3 className="text-sm font-bold text-ink">No requests match this filter</h3>
            <p className="text-xs text-muted mt-1">
              Select another tab or post a new request to get started.
            </p>
          </div>
        )}
      </div>

      {/* ── CANCEL CONFIRMATION MODAL ── */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-border p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink">Cancel this request?</h3>
                <p className="text-xs text-muted mt-1.5 leading-relaxed">
                  Cancelling will remove this listing from the marketplace. Any tokens
                  held in escrow will be immediately refunded back to your balance.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setCancelModalId(null)}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-ink transition-colors cursor-pointer"
              >
                Keep Request
              </button>
              <button
                onClick={() => handleCancel(cancelModalId)}
                className="bg-rose-600 text-white px-4 py-2 text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Yes, Cancel &amp; Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
