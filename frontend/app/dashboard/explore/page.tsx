"use client";

import { useState } from "react";
import Link from "next/link";
import SkillSearchBar from "@/components/explore/SkillSearchBar";
import TutorList from "@/components/explore/TutorList";
import BookingModal from "@/components/bookings/BookingModal";
import ServiceDetailModal from "@/components/explore/ServiceDetailModal";
import { useTutors } from "@/lib/hooks/useTutors";
import type { TutorSkillListing } from "@/lib/types";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDetailListing, setSelectedDetailListing] = useState<TutorSkillListing | null>(null);
  const [selectedListing, setSelectedListing] = useState<TutorSkillListing | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const { data: listings = [], isLoading } = useTutors(searchQuery);

  const handleBook = (listing: TutorSkillListing) => {
    setSelectedListing(listing);
  };

  const handleViewDetails = (listing: TutorSkillListing) => {
    setSelectedDetailListing(listing);
  };

  const handleBookFromDetails = (listing: TutorSkillListing) => {
    setSelectedDetailListing(null);
    setSelectedListing(listing);
  };

  const handleBookingSuccess = () => {
    if (selectedListing) {
      setSuccessNotice(
        `Your request for "${selectedListing.skillName}" has been sent to ${selectedListing.firstName}. Your tokens are held safely in escrow until completion.`
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
            Explore Skills &amp; Services
          </h1>
          <p className="text-sm text-muted mt-1">
            Discover campus peers for practical repairs, moving help, technical tutoring, and creative services.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-border px-4 py-2.5 rounded text-xs text-muted">
          <Sparkles className="size-4 text-purple" />
          <span>
            <strong className="text-ink font-bold">{listings.length}</strong> available listings
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
        placeholder="Search by skill or task (e.g. plumbing leak, moving, Figma, Python, Calculus)..."
      />

      {/* ── LISTINGS GRID ── */}
      <TutorList
        tutors={listings}
        isLoading={isLoading}
        onBook={handleBook}
        onViewDetails={handleViewDetails}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
      />

      {/* ── SERVICE DETAIL & REVIEWS MODAL ── */}
      <ServiceDetailModal
        isOpen={Boolean(selectedDetailListing)}
        onClose={() => setSelectedDetailListing(null)}
        tutor={selectedDetailListing}
        onBook={handleBookFromDetails}
      />

      {/* ── BOOKING MODAL ── */}
      <BookingModal
        isOpen={Boolean(selectedListing)}
        onClose={() => setSelectedListing(null)}
        tutor={selectedListing}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
}
