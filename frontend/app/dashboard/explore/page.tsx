"use client";

import { useState } from "react";
import Link from "next/link";
import SkillSearchBar from "@/components/explore/SkillSearchBar";
import TutorList from "@/components/explore/TutorList";
import BookingModal from "@/components/bookings/BookingModal";
import { useTutors } from "@/lib/hooks/useTutors";
import type { TutorSkillListing } from "@/lib/types";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTutor, setSelectedTutor] = useState<TutorSkillListing | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const { data: tutors = [], isLoading } = useTutors(searchQuery);

  const handleBook = (tutor: TutorSkillListing) => {
    setSelectedTutor(tutor);
  };

  const handleBookingSuccess = () => {
    if (selectedTutor) {
      setSuccessNotice(
        `Your session request for "${selectedTutor.skillName}" has been sent to ${selectedTutor.firstName}. Your tokens are held in escrow until completion.`
      );
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* ── HEADER ── */}
      <section className="bg-white border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-mint text-ink px-2.5 py-1 inline-block mb-3">
            Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Explore Skills &amp; Tutors
          </h1>
          <p className="text-sm text-muted mt-1">
            Discover student peers across universities, compare token rates, and book 1-on-1 exchange sessions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-border px-4 py-2.5 rounded text-xs text-muted">
          <Sparkles className="size-4 text-purple" />
          <span>
            <strong className="text-ink font-bold">{tutors.length}</strong> available tutors
          </span>
        </div>
      </section>

      {/* ── SUCCESS NOTICE BANNER ── */}
      {successNotice && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start sm:items-center gap-3">
            <CheckCircle2 className="size-5 text-emerald-700 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-xs font-medium text-emerald-950">
              {successNotice}
            </p>
          </div>

          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-white border border-emerald-300 px-3 py-1.5 hover:bg-emerald-100/60 transition-colors shrink-0"
          >
            <span>View in Bookings</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}

      {/* ── SEARCH BAR ── */}
      <SkillSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by skill (e.g. React, Calculus, Figma, Python) or university..."
      />

      {/* ── TUTORS LIST GRID ── */}
      <TutorList
        tutors={tutors}
        isLoading={isLoading}
        onBook={handleBook}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
      />

      {/* ── BOOKING MODAL ── */}
      <BookingModal
        isOpen={Boolean(selectedTutor)}
        onClose={() => setSelectedTutor(null)}
        tutor={selectedTutor}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
}
