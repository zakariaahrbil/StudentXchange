"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";

export default function RequestsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* ── HEADER ── */}
      <section className="bg-white border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-mint text-ink px-2.5 py-1 inline-block mb-3">
            Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Skill Requests
          </h1>
          <p className="text-sm text-muted mt-1">
            Browse skills students are requesting or ask for help with a subject.
          </p>
        </div>

        <Link
          href="/dashboard/requests/new"
          className="inline-flex items-center gap-2 bg-ink text-white px-4 py-2.5 text-xs font-semibold hover:bg-ink/85 transition-colors"
        >
          <Plus className="size-4" />
          <span>New Request</span>
        </Link>
      </section>

      {/* ── SEARCH & FILTER (PLACEHOLDER) ── */}
      <div className="flex items-center gap-3 bg-white border border-border px-4 py-3">
        <Search className="size-4 text-muted" />
        <input
          type="text"
          placeholder="Search requests by topic or skill (e.g. Calculus, React, Physics)..."
          className="flex-1 text-xs text-ink placeholder:text-faint outline-none bg-transparent"
        />
      </div>

      {/* ── EMPTY STATE / FEED PLACEHOLDER ── */}
      <div className="bg-white border border-border p-12 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-muted mb-4">
          <Search className="size-5" />
        </div>
        <h2 className="text-base font-bold text-ink">No requests posted yet</h2>
        <p className="text-xs text-muted mt-1 max-w-sm">
          Be the first student to post a request or check back soon when other classmates share theirs.
        </p>
        <Link
          href="/dashboard/requests/new"
          className="mt-6 text-xs font-semibold bg-mint text-ink px-5 py-2 hover:bg-mint/80 transition-colors"
        >
          Post the First Request
        </Link>
      </div>
    </div>
  );
}
