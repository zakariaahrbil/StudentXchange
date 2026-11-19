"use client";

import { Mail, Phone, Calendar, ArrowRight } from "lucide-react";
import type { TutorSkillListing } from "@/lib/types";

interface TutorCardProps {
  tutor: TutorSkillListing;
  onBook: (tutor: TutorSkillListing) => void;
}

export default function TutorCard({ tutor, onBook }: TutorCardProps) {
  const initials = `${tutor.firstName?.[0] ?? "T"}${tutor.lastName?.[0] ?? "S"}`.toUpperCase();
  const fullName = `${tutor.firstName} ${tutor.lastName}`;

  return (
    <div className="bg-white border border-border p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-border/80 hover:shadow-sm">
      {/* ── TOP SECTION: AVATAR & NAME ── */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-mint text-ink font-bold text-sm flex items-center justify-center border border-border shrink-0">
              {initials}
            </div>

            <div>
              <h3 className="text-sm font-bold text-ink leading-tight">
                {fullName}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                {tutor.university ?? "Student Tutor"}
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

        {/* ── SKILL TOPIC ── */}
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
            Skill Offered
          </span>
          <p className="text-sm font-bold text-ink bg-slate-50 border border-border px-3 py-2">
            {tutor.skillName}
          </p>
        </div>

        {/* ── ALWAYS VISIBLE DIRECT CONTACT ── */}
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
            <a
              href={`mailto:${tutor.email}`}
              className="flex items-center gap-2 text-muted hover:text-ink hover:underline truncate"
              title={tutor.email}
            >
              <Mail className="size-3.5 shrink-0 text-muted" />
              <span className="truncate">{tutor.email}</span>
            </a>

            {tutor.phoneNumber ? (
              <a
                href={`tel:${tutor.phoneNumber}`}
                className="flex items-center gap-2 text-muted hover:text-ink hover:underline"
                title={tutor.phoneNumber}
              >
                <Phone className="size-3.5 shrink-0 text-muted" />
                <span>{tutor.phoneNumber}</span>
              </a>
            ) : (
              <span className="flex items-center gap-2 text-muted/60 italic text-[11px]">
                <Phone className="size-3.5 shrink-0 text-muted/40" />
                <span>No phone listed</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── ACTION BUTTON ── */}
      <button
        type="button"
        onClick={() => onBook(tutor)}
        className="w-full bg-ink text-white py-2.5 px-4 text-xs font-semibold hover:bg-ink/85 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
      >
        <Calendar className="size-3.5" />
        <span>Book Session</span>
        <ArrowRight className="size-3.5" />
      </button>
    </div>
  );
}
