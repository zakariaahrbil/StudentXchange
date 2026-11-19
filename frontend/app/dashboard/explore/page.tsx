"use client";

import { useState } from "react";
import SkillSearchBar from "@/components/explore/SkillSearchBar";
import TutorList from "@/components/explore/TutorList";
import { useTutors } from "@/lib/hooks/useTutors";
import type { TutorSkillListing } from "@/lib/types";
import { Sparkles } from "lucide-react";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: tutors = [], isLoading } = useTutors(searchQuery);

  const handleBook = (tutor: TutorSkillListing) => {
    // In Step 4, this triggers the BookingModal
    alert(`Booking modal for ${tutor.firstName} (${tutor.skillName}) will open here!`);
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
    </div>
  );
}
