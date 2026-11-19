"use client";

import { useState } from "react";
import { Calendar, Mail, Phone, Star, CheckCircle2 } from "lucide-react";
import type { Booking } from "@/lib/types";
import BookingTimeline from "./BookingTimeline";
import ReviewModal from "./ReviewModal";

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
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const isPending = booking.status === "PENDING";
  const isAccepted = booking.status === "ACCEPTED";
  const isCompleted = booking.status === "COMPLETED";

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
  const partnerRoleLabel = role === "learner" ? "Provider" : "Requester";
  const partnerEmail =
    role === "learner"
      ? `peer.${booking.skillOwnerId.slice(0, 5)}@campus.edu`
      : `student.${booking.buyerId.slice(0, 5)}@campus.edu`;
  const partnerPhone =
    role === "learner" ? "+1 (555) 314-8821" : "+1 (555) 792-1140";

  return (
    <div className="bg-white border border-border p-5 sm:p-6 flex flex-col justify-between gap-5 transition-all">
      {/* ── TOP BAR: CLEAN STATUS & TOKENS ── */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {isPending && (
              <span className="text-xs font-medium text-muted bg-slate-50 border border-border px-2.5 py-0.5">
                Pending Approval
              </span>
            )}

            {isAccepted && (
              <span className="text-xs font-semibold text-ink bg-mint border border-mint/80 px-2.5 py-0.5">
                In Progress
              </span>
            )}

            {isCompleted && (
              <span className="text-xs font-medium text-ink bg-slate-100 border border-border px-2.5 py-0.5">
                Completed
              </span>
            )}

            {!isPending && !isAccepted && !isCompleted && (
              <span className="text-xs text-muted border border-border px-2.5 py-0.5">
                Closed
              </span>
            )}
          </div>

          <div className="text-xs font-semibold text-ink">
            {booking.price} Tokens in Escrow
          </div>
        </div>

        {/* Skill Title */}
        <h3 className="text-base font-bold text-ink">
          {booking.skillName}
        </h3>

        {/* Realization Date & Time */}
        <div className="flex items-center gap-2 text-xs text-muted mt-2">
          <Calendar className="size-3.5 text-muted" />
          <span>Scheduled: <strong className="text-ink font-semibold">{sessionDateFormatted}</strong></span>
        </div>

        {/* Session Description (if provided) */}
        {booking.description && (
          <p className="text-xs text-muted mt-2.5 bg-slate-50 p-2.5 border border-border/60">
            &ldquo;{booking.description}&rdquo;
          </p>
        )}

        {/* ── ALWAYS-VISIBLE PEER CONTACT ── */}
        <div className="mt-4 pt-3 border-t border-border flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            {partnerRoleLabel} Contact (Always Visible)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 text-xs">
            <a
              href={`mailto:${partnerEmail}`}
              className="flex items-center gap-2 bg-[#FAFAFA] border border-border px-3 py-2 text-ink hover:border-ink transition-colors truncate"
            >
              <Mail className="size-3.5 shrink-0 text-muted" />
              <span className="truncate font-medium">{partnerEmail}</span>
            </a>

            <a
              href={`tel:${partnerPhone}`}
              className="flex items-center gap-2 bg-[#FAFAFA] border border-border px-3 py-2 text-ink hover:border-ink transition-colors"
            >
              <Phone className="size-3.5 shrink-0 text-muted" />
              <span className="font-medium">{partnerPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── TIMELINE PROGRESS ── */}
      <BookingTimeline status={booking.status} />

      {/* ── ACTION BUTTONS ── */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        {/* LEARNER / CLIENT ACTIONS */}
        {role === "learner" && isPending && onCancel && (
          <button
            type="button"
            onClick={() => onCancel(booking.id)}
            disabled={isActionPending}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 px-4 py-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel Request &amp; Refund
          </button>
        )}

        {role === "learner" && isAccepted && (
          <p className="text-xs text-muted italic">
            Service in progress. Connect with provider via phone or email.
          </p>
        )}

        {role === "learner" && isCompleted && (
          <>
            {hasReviewed ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted font-medium bg-slate-50 border border-border px-3 py-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>Review Submitted</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setIsReviewOpen(true)}
                className="inline-flex items-center gap-1.5 bg-ink text-white px-4 py-2 text-xs font-semibold hover:bg-ink/85 transition-colors cursor-pointer shadow-xs"
              >
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span>Leave a Review</span>
              </button>
            )}
          </>
        )}

        {/* PROVIDER ACTIONS */}
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
                Accept Request
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
            Mark Completed
          </button>
        )}
      </div>

      {/* ── REVIEW MODAL FOR COMPLETED BOOKINGS ── */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        booking={booking}
        onSuccess={() => setHasReviewed(true)}
      />
    </div>
  );
}
