"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewRequestPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      {/* ── BACK LINK ── */}
      <div>
        <Link
          href="/dashboard/requests"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Requests</span>
        </Link>
      </div>

      {/* ── FORM CONTAINER ── */}
      <section className="bg-white border border-border p-6 sm:p-8">
        <div className="border-b border-border pb-4 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-mint text-ink px-2.5 py-1 inline-block mb-3">
            Exchange
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Create a Skill Request
          </h1>
          <p className="text-sm text-muted mt-1">
            Describe what you need help with and how many tokens you are offering.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
          {/* Skill Title */}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Topic or Skill Needed
            </label>
            <input
              type="text"
              placeholder="e.g. Data Structures & Algorithms Tutoring"
              className="w-full px-3.5 py-2.5 border border-border text-sm text-ink placeholder:text-faint outline-none focus:border-purple"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Details &amp; Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe what specific help you need, your current level, and when you'd like to meet..."
              className="w-full px-3.5 py-2.5 border border-border text-sm text-ink placeholder:text-faint outline-none focus:border-purple resize-none"
            />
          </div>

          {/* Token Reward */}
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Offered Token Reward
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                defaultValue={10}
                min={1}
                className="w-32 px-3.5 py-2.5 border border-border text-sm text-ink outline-none focus:border-purple"
              />
              <span className="text-xs font-semibold text-purple bg-purple/10 px-2.5 py-1 rounded">
                Tokens
              </span>
            </div>
            <p className="text-xs text-faint mt-1.5">
              Tokens are held securely and only transferred when the exchange session is completed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-border pt-6 flex items-center justify-end gap-3">
            <Link
              href="/dashboard/requests"
              className="px-4 py-2 text-xs font-semibold text-muted hover:text-ink transition-colors"
            >
              Cancel
            </Link>
            <button
              type="button"
              className="bg-ink text-white px-6 py-2.5 text-xs font-semibold hover:bg-ink/85 transition-colors cursor-pointer"
            >
              Post Request
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
