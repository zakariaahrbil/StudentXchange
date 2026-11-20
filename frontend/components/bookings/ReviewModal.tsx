"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Star, AlertCircle, Loader2 } from "lucide-react";
import { reviewFormSchema, type ReviewFormData } from "@/lib/validations/reviews";
import { useCreateReview } from "@/lib/hooks/useReviews";
import { getApiErrorMessage } from "@/lib/errors";
import type { Booking } from "@/lib/types";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSuccess?: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

export default function ReviewModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
}: ReviewModalProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutate: submitReview, isPending } = useCreateReview();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const selectedRating = watch("rating");
  const commentValue = watch("comment") ?? "";

  // Reset form when opened or booking changes
  useEffect(() => {
    if (isOpen) {
      reset({
        rating: 5,
        comment: "",
      });
      setApiError(null);
      setHoveredRating(null);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, reset]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && !isPending) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onClose]);

  if (!isOpen || !booking) return null;

  const activeRating = hoveredRating ?? selectedRating ?? 5;

  const onSubmit = (data: ReviewFormData) => {
    setApiError(null);

    submitReview(
      {
        skillId: booking.skillId,
        payload: {
          bookingId: booking.id,
          rating: data.rating,
          comment: data.comment.trim(),
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
        onError: (err) => {
          setApiError(
            getApiErrorMessage(err, "Failed to submit review. Please try again.")
          );
        },
      }
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isPending) onClose();
        }}
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 w-full max-w-md bg-white border border-border shadow-lg p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-mint text-ink px-2 py-0.5 inline-block mb-1.5">
              Service Feedback
            </span>
            <h2 id="review-modal-title" className="text-lg font-bold text-ink">
              Rate Your Experience
            </h2>
            <p className="text-xs text-muted mt-0.5">
              for <strong className="text-ink font-semibold">{booking.skillName}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-muted hover:text-ink p-1 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <div className="mb-5 bg-rose-50 border border-rose-200 p-3 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Rating Stars Picker */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Overall Rating <span className="text-rose-500">*</span>
            </label>

            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHoveredRating(null)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue("rating", star, { shouldValidate: true })}
                    onMouseEnter={() => setHoveredRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`size-6 transition-colors ${
                        star <= activeRating
                          ? "fill-amber-400 text-amber-500"
                          : "fill-transparent text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <span className="text-xs font-semibold text-ink ml-1">
                {activeRating} / 5
              </span>

              <span className="text-xs text-muted">
                ({RATING_LABELS[activeRating] ?? "Good"})
              </span>
            </div>

            {errors.rating && (
              <p className="text-xs text-rose-600 mt-1">{errors.rating.message}</p>
            )}
          </div>

          {/* Comment Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="review-comment" className="text-xs font-semibold text-ink">
                Feedback Comment <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-muted">
                {commentValue.length} / 2000
              </span>
            </div>

            <textarea
              id="review-comment"
              rows={4}
              maxLength={2000}
              placeholder="Share how the session went, peer punctuality, and quality of assistance..."
              {...register("comment")}
              className={`w-full text-xs p-3 border bg-[#FAFAFA] text-ink placeholder:text-muted/60 focus:bg-white focus:outline-none focus:border-ink resize-none transition-colors ${
                errors.comment ? "border-rose-300" : "border-border"
              }`}
            />

            {errors.comment && (
              <p className="text-xs text-rose-600 mt-1">{errors.comment.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="text-xs font-semibold text-muted hover:text-ink px-4 py-2 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending || !commentValue.trim()}
              className="bg-ink text-white px-5 py-2.5 text-xs font-semibold hover:bg-ink/85 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <Loader2 className="size-3.5 animate-spin" />}
              <span>{isPending ? "Submitting..." : "Submit Review"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
