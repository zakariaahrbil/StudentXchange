"use client";

import { useEffect, useState } from "react";
import { X, CalendarCheck } from "lucide-react";
import BookingForm from "./BookingForm";
import type { TutorSkillListing } from "@/lib/types";
import type { BookingFormInput } from "@/lib/validations/bookings";
import { toCreateBookingPayload } from "@/lib/validations/bookings";
import { useCreateBooking } from "@/lib/hooks/useBookings";
import { getApiErrorMessage } from "@/lib/errors";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: TutorSkillListing | null;
  onSuccess: () => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  tutor,
  onSuccess,
}: BookingModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: createBooking, isPending } = useCreateBooking();

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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setErrorMessage(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !tutor) return null;

  const handleSubmit = (data: BookingFormInput) => {
    setErrorMessage(null);

    createBooking(
      {
        skillId: tutor.skillId,
        payload: toCreateBookingPayload(data),
      },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
        onError: (err: unknown) => {
          setErrorMessage(
            getApiErrorMessage(
              err,
              "Failed to schedule booking. Please verify the session time is in the future."
            )
          );
        },
      }
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg bg-white border border-border shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── MODAL HEADER ── */}
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-mint text-ink flex items-center justify-center border border-border shrink-0">
              <CalendarCheck className="size-4" />
            </div>
            <div>
              <h3 id="booking-modal-title" className="text-lg font-bold text-ink">
                Book a Skill Session
              </h3>
              <p className="text-xs text-muted">
                Schedule a 1-on-1 exchange with {tutor.firstName}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-muted hover:text-ink transition-colors p-1 -mr-1 cursor-pointer disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ── FORM ── */}
        <BookingForm
          tutor={tutor}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isPending}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}
