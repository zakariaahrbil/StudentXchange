"use client";

import { useEffect } from "react";
import { X, Star, Phone, ShieldCheck, MessageSquare, CalendarCheck, Loader2 } from "lucide-react";
import type { TutorSkillListing } from "@/lib/types";
import { useSkillReviews } from "@/lib/hooks/useReviews";

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: TutorSkillListing | null;
  onBook: (tutor: TutorSkillListing) => void;
}

export default function ServiceDetailModal({
  isOpen,
  onClose,
  tutor,
  onBook,
}: ServiceDetailModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Load live reviews from backend for this specific skill
  const { data: reviews = [], isLoading: isLoadingReviews } = useSkillReviews(
    tutor?.skillId ?? ""
  );

  if (!isOpen || !tutor) return null;

  const initials = `${tutor.firstName?.[0] ?? "P"}${tutor.lastName?.[0] ?? "S"}`.toUpperCase();
  const fullName = `${tutor.firstName} ${tutor.lastName}`;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : tutor.rating;

  function handleBookClick() {
    if (!tutor) return;
    onClose();
    onBook(tutor);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white border border-border w-full max-w-2xl shadow-xl z-10 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* ── HEADER ── */}
        <div className="flex items-start justify-between p-6 border-b border-border bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-mint text-ink font-bold text-base flex items-center justify-center border border-border shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-ink px-2 py-0.5 rounded">
                  Service Offering
                </span>
                {averageRating && averageRating > 0 ? (
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-ink bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
                    <Star className="size-3 fill-amber-400 text-amber-500" />
                    <span>{averageRating.toFixed(1)}</span>
                    <span className="text-[10px] text-muted font-normal">
                      ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-muted bg-slate-100 px-2 py-0.5 rounded">
                    New Offering
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-ink mt-1 leading-tight">
                {tutor.skillName}
              </h2>
              <p className="text-xs text-muted">
                Offered by <span className="font-semibold text-ink">{fullName}</span> &bull; {tutor.university ?? "Campus Peer"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-ink p-1 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ── MODAL BODY ── */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Rate & Escrow Guarantee Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-border">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                Session Exchange Rate
              </span>
              <div className="text-xl font-bold text-ink mt-0.5">
                {tutor.price}{" "}
                <span className="text-xs font-semibold text-purple">Tokens</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted sm:border-l sm:border-border sm:pl-4">
              <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
              <span>
                Tokens held securely in escrow until session completion.
              </span>
            </div>
          </div>

          {/* Service Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
              Service Details &amp; Scope
            </h3>
            <p className="text-sm text-ink leading-relaxed whitespace-pre-line bg-white border border-border p-4">
              {tutor.description || "The tutor has not provided an extended description for this service offering."}
            </p>
          </div>

          {/* Provider Direct Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
              Direct Contact
            </h3>
            <div className="bg-[#FAFAFA] border border-border p-4 space-y-2 text-xs">
              {tutor.phoneNumber ? (
                <div className="flex items-center gap-2 text-ink">
                  <Phone className="size-4 text-muted shrink-0" />
                  <span className="font-semibold">Phone:</span>
                  <a
                    href={`tel:${tutor.phoneNumber}`}
                    className="hover:underline text-muted hover:text-ink"
                  >
                    {tutor.phoneNumber}
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted">
                  <Phone className="size-4 text-muted/60 shrink-0" />
                  <span>No direct phone number listed on profile.</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-muted">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span>
                  Official campus email and session messaging are unlocked upon booking confirmation.
                </span>
              </div>
            </div>
          </div>

          {/* Peer Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-muted" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink">
                  Student Reviews &amp; Feedback ({reviews.length})
                </h3>
              </div>
            </div>

            {isLoadingReviews ? (
              <div className="flex items-center justify-center py-8 border border-border bg-[#FAFAFA]">
                <Loader2 className="size-5 animate-spin text-muted" />
                <span className="text-xs text-muted ml-2">Loading peer reviews…</span>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-white border border-border flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <Star
                            key={starVal}
                            className={`size-3.5 ${
                              starVal <= review.rating
                                ? "fill-amber-400 text-amber-500"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-ink ml-1.5">
                          {review.rating}.0
                        </span>
                      </div>

                      <span className="text-[11px] text-muted">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {review.comment ? (
                      <p className="text-xs text-ink leading-relaxed">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted/60 italic">
                        Rating submitted without comment.
                      </p>
                    )}

                    <div className="pt-1 border-t border-border/40 flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                      <ShieldCheck className="size-3" />
                      <span>Verified Completed Exchange</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-border bg-[#FAFAFA]">
                <p className="text-xs font-semibold text-ink">No reviews yet</p>
                <p className="text-[11px] text-muted mt-1">
                  Be the first campus peer to complete an exchange with {fullName} and leave a review!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="p-4 sm:p-6 border-t border-border bg-[#FAFAFA] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-muted hover:text-ink transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleBookClick}
            className="inline-flex items-center gap-2 bg-ink text-white px-5 py-2.5 text-xs font-semibold hover:bg-ink/85 transition-colors cursor-pointer shadow-xs"
          >
            <CalendarCheck className="size-4" />
            <span>Book This Service ({tutor.price} Tokens)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
