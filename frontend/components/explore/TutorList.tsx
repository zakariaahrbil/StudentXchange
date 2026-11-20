"use client";

import TutorCard from "./TutorCard";
import type { TutorSkillListing } from "@/lib/types";
import { Search, Sparkles } from "lucide-react";

interface TutorListProps {
  tutors: TutorSkillListing[];
  isLoading: boolean;
  onBook: (tutor: TutorSkillListing) => void;
  onViewDetails?: (tutor: TutorSkillListing) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function TutorList({
  tutors,
  isLoading,
  onBook,
  onViewDetails,
  searchQuery,
  onClearSearch,
}: TutorListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="bg-white border border-border p-6 animate-pulse flex flex-col justify-between h-80"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-slate-200" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-2/3 mb-1.5" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="h-10 bg-slate-100 rounded mb-4" />
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
            <div className="h-9 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (tutors.length === 0) {
    const isFiltered = Boolean(searchQuery && searchQuery.trim() !== "");

    return (
      <div className="bg-white border border-border p-12 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-muted mb-4">
          {isFiltered ? <Search className="size-5" /> : <Sparkles className="size-5 text-purple" />}
        </div>
        <h3 className="text-base font-bold text-ink">
          {isFiltered ? "No matching peer services found" : "Discover Peer Offerings"}
        </h3>
        <p className="text-xs text-muted mt-1 max-w-md">
          {isFiltered
            ? `We couldn't find any services matching "${searchQuery}". Try searching for plumbing, leaks, moving, design, or python.`
            : "Search by skill name, topic, or keyword in the search bar above to discover offerings from campus peers."}
        </p>

        {isFiltered && onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="mt-5 text-xs font-semibold bg-mint text-ink px-4 py-2 hover:bg-mint/80 transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tutors.map((tutor) => (
        <TutorCard
          key={tutor.id}
          tutor={tutor}
          onBook={onBook}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
