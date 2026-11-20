"use client";

import { Phone, Calendar, ArrowRight, Star, ExternalLink } from "lucide-react";
import type { TutorSkillListing } from "@/lib/types";

interface TutorCardProps {
  tutor: TutorSkillListing;
  onBook: (tutor: TutorSkillListing) => void;
  onViewDetails?: (tutor: TutorSkillListing) => void;
}

export default function TutorCard({ tutor, onBook, onViewDetails }: TutorCardProps) {
  const initials = `${tutor.firstName?.[0] ?? "P"}${tutor.lastName?.[0] ?? "S"}`.toUpperCase();
  const fullName = `${tutor.firstName} ${tutor.lastName}`;
  const hasRating = typeof tutor.rating === "number" && tutor.rating > 0;

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(tutor);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-border p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-ink/40 hover:shadow-sm cursor-pointer group"
    >
      {/* ── TOP SECTION: AVATAR, NAME, RATING & PRICE ── */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-mint text-ink font-bold text-sm flex items-center justify-center border border-border shrink-0">
              {initials}
            </div>

            <div>
              <h3 className="text-sm font-bold text-ink leading-tight group-hover:text-purple transition-colors">
                {fullName}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                {tutor.university ?? "Campus Peer"}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-sm font-bold text-ink">
              {tutor.price}{" "}
              <span className="text-xs font-semibold text-purple">Tokens</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-muted font-medium">
              per session
            </span>
          </div>
        </div>

        {/* ── SKILL TOPIC & RATING ROW ── */}
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Skill / Service
            </span>

            {/* Live Backend Rating */}
            {hasRating ? (
              <div className="inline-flex items-center gap-1 text-xs font-bold text-ink bg-amber-50/80 border border-amber-200/60 px-2 py-0.5 rounded">
                <Star className="size-3 fill-amber-400 text-amber-500" />
                <span>{tutor.rating!.toFixed(1)}</span>
              </div>
            ) : (
              <span className="text-[10px] text-muted bg-slate-100 px-1.5 py-0.5 rounded">
                New Offering
              </span>
            )}
          </div>

          <h4 className="text-sm font-bold text-ink bg-slate-50 border border-border px-3 py-2 flex items-center justify-between">
            <span className="truncate">{tutor.skillName}</span>
            <ExternalLink className="size-3 text-muted/60 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" />
          </h4>

          {/* Service Description */}
          {tutor.description && (
            <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-2">
              {tutor.description}
            </p>
          )}
        </div>

        {/* ── DIRECT CONTACT ── */}
        <div className="border-t border-border/80 pt-3 mb-5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Direct Contact
            </span>
            <span className="text-[9px] uppercase tracking-wider bg-mint/20 text-ink px-1.5 py-0.5 rounded font-semibold">
              Always Visible
            </span>
          </div>

          <div className="flex flex-col gap-1 mt-1 text-xs">
            {tutor.phoneNumber ? (
              <a
                href={`tel:${tutor.phoneNumber}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-muted hover:text-ink hover:underline"
                title={tutor.phoneNumber}
              >
                <Phone className="size-3.5 shrink-0 text-muted" />
                <span>{tutor.phoneNumber}</span>
              </a>
            ) : (
              <span className="flex items-center gap-2 text-muted/60 italic text-[11px]">
                <Phone className="size-3.5 shrink-0 text-muted/40" />
                <span>No phone listed &bull; details in modal</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── ACTION BUTTONS ── */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/60">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.(tutor);
          }}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-ink py-2 px-3 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>Reviews &amp; Details</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBook(tutor);
          }}
          className="flex-1 bg-ink text-white py-2 px-3 text-xs font-semibold hover:bg-ink/85 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Calendar className="size-3.5" />
          <span>Book Now</span>
          <ArrowRight className="size-3" />
        </button>
      </div>
    </div>
  );
}
