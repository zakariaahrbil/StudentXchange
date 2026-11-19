"use client";

import { Calendar, Clock, Mail, Phone, CheckCircle2, AlertCircle, Ban } from "lucide-react";
import type { Booking } from "@/lib/types";
import BookingTimeline from "./BookingTimeline";

interface BookingCardProps {
  booking: Booking;
  role: "learner" | "tutor";
  onAccept?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  onComplete?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  isActionPending?: boolean;
}

export default function BookingCard({
  booking,
  role,
  onAccept,
  onReject,
  onComplete,
  onCancel,
  isActionPending = false,
}: BookingCardProps) {
  const isPending = booking.status === "PENDING";
  const isAccepted = booking.status === "ACCEPTED";
  const isCompleted = booking.status === "COMPLETED";
  const isCancelled = booking.status === "CANCELLED" || booking.status === "REJECTED";

  // Format realization date
  const sessionDateFormatted = booking.realizationAt
    ? new Date(booking.realizationAt).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Date not specified";

  // Partner display details (contact is ALWAYS visible)
  const partnerRoleLabel = role === "learner" ? "Tutor" : "Student Learner";
  const partnerEmail =
    role === "learner"
      ? `tutor.${booking.skillOwnerId.slice(0, 5)}@campus.edu`
      : `student.${booking.buyerId.slice(0, 5)}@campus.edu`;
  const partnerPhone =
    role === "learner" ? "+1 (555) 314-8821" : "+1 (555) 792-1140";

  return (
    <div className="bg-white border border-border p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all hover:border-border/80">
      {/* ── TOP BAR: SKILL, ROLE BADGE, TOKENS ── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                role === "learner"
                  ? "bg-purple/10 text-purple border-purple/20"
                  : "bg-mint/30 text-ink border-mint/40"
              }`}
            >
              {role === "learner" ? "Learning" : "Teaching"}
            </span>

            {isPending && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                <Clock className="size-3" />
                Pending Approval
              </span>
            )}

            {isAccepted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="size-3" />
                Accepted • In Progress
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
                <Ban className="size-3" />
                Closed
              </span>
            )}
          </div>

          <div className="text-sm font-bold text-ink bg-slate-50 border border-border px-3 py-1 rounded w-fit">
            {booking.price} Tokens Escrowed
          </div>
        </div>

        {/* Skill Title */}
        <h3 className="text-base sm:text-lg font-bold text-ink">
          {booking.skillName}
        </h3>

        {/* Realization Date & Time */}
        <div className="flex items-center gap-2 text-xs font-semibold text-purple mt-2">
          <Calendar className="size-3.5" />
          <span>Scheduled Session: {sessionDateFormatted}</span>
        </div>

        {/* Session Description (if provided) */}
        {booking.description && (
          <p className="text-xs text-muted mt-2.5 bg-slate-50 p-2.5 border border-border/60 rounded italic">
            &ldquo;{booking.description}&rdquo;
          </p>
        )}

        {/* ── ALWAYS-VISIBLE PEER CONTACT ── */}
        <div className="mt-4 pt-3 border-t border-border/70 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
              {partnerRoleLabel} Contact (Always Visible)
            </span>
            <span className="text-[9px] uppercase tracking-wider bg-mint/20 text-ink px-1.5 py-0.5 rounded font-semibold">
              Direct Contact
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 text-xs">
            <a
              href={`mailto:${partnerEmail}`}
              className="flex items-center gap-2 bg-[#FAFAFA] border border-border px-3 py-1.5 text-muted hover:text-ink hover:underline truncate"
            >
              <Mail className="size-3.5 shrink-0 text-muted" />
              <span className="truncate">{partnerEmail}</span>
            </a>

            <a
              href={`tel:${partnerPhone}`}
              className="flex items-center gap-2 bg-[#FAFAFA] border border-border px-3 py-1.5 text-muted hover:text-ink hover:underline"
            >
              <Phone className="size-3.5 shrink-0 text-muted" />
              <span>{partnerPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── TIMELINE PROGRESS ── */}
      <BookingTimeline status={booking.status} />

      {/* ── ACTION BUTTONS ── */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        {/* LEARNER ACTIONS */}
        {role === "learner" && isPending && onCancel && (
          <button
            type="button"
            onClick={() => onCancel(booking.id)}
            disabled={isActionPending}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 px-4 py-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel Booking &amp; Refund
          </button>
        )}

        {role === "learner" && isAccepted && (
          <p className="text-xs text-muted italic">
            Session in progress. Reach out via phone or email to meet.
          </p>
        )}

        {/* TUTOR ACTIONS */}
        {role === "tutor" && isPending && (
          <>
            {onReject && (
              <button
                type="button"
                onClick={() => onReject(booking.id)}
                disabled={isActionPending}
                className="text-xs font-semibold text-muted hover:text-ink px-3 py-2 cursor-pointer disabled:opacity-50"
              >
                Decline
              </button>
            )}

            {onAccept && (
              <button
                type="button"
                onClick={() => onAccept(booking.id)}
                disabled={isActionPending}
                className="bg-ink text-white px-5 py-2 text-xs font-semibold hover:bg-ink/85 transition-colors cursor-pointer disabled:opacity-50"
              >
                Accept Session
              </button>
            )}
          </>
        )}

        {role === "tutor" && isAccepted && onComplete && (
          <button
            type="button"
            onClick={() => onComplete(booking.id)}
            disabled={isActionPending}
            className="bg-mint text-ink px-5 py-2 text-xs font-semibold hover:bg-mint/80 transition-colors cursor-pointer disabled:opacity-50"
          >
            Mark Session Completed
          </button>
        )}
      </div>
    </div>
  );
}
