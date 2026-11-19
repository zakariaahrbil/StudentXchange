"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookingFormSchema,
  type BookingFormInput,
} from "@/lib/validations/bookings";
import type { TutorSkillListing } from "@/lib/types";
import { Calendar, Clock, ShieldCheck, AlertCircle } from "lucide-react";

interface BookingFormProps {
  tutor: TutorSkillListing;
  onSubmit: (data: BookingFormInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export default function BookingForm({
  tutor,
  onSubmit,
  onCancel,
  isSubmitting = false,
  errorMessage,
}: BookingFormProps) {
  // Suggest minimum time as 1 hour from now formatted for datetime-local
  const minDateTime = new Date(Date.now() + 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormInput>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      skillId: tutor.skillId,
      realizationAt: "",
      description: "",
    },
  });

  const descriptionValue = watch("description") || "";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* ── TUTOR & SKILL SUMMARY ── */}
      <div className="bg-slate-50 border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Session Details
          </span>
          <h4 className="text-sm font-bold text-ink mt-0.5">
            {tutor.skillName}
          </h4>
          <p className="text-xs text-muted">
            Taught by {tutor.firstName} {tutor.lastName} ({tutor.university ?? "Campus Peer"})
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="text-sm font-bold text-ink">
            {tutor.price} <span className="text-xs font-semibold text-purple">Tokens</span>
          </div>
          <span className="text-[10px] text-muted font-medium">Escrow hold</span>
        </div>
      </div>

      {/* Hidden skillId */}
      <input type="hidden" {...register("skillId")} value={tutor.skillId} />

      {/* ── ERROR BANNER ── */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── REALIZATION DATE & TIME ── */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
          Proposed Session Date &amp; Time
        </label>
        <div className="relative">
          <input
            type="datetime-local"
            min={minDateTime}
            {...register("realizationAt")}
            className="w-full px-3.5 py-2.5 bg-white border border-border text-sm text-ink outline-none focus:border-purple"
          />
        </div>
        {errors.realizationAt && (
          <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1.5">
            <AlertCircle className="size-3" />
            {errors.realizationAt.message}
          </p>
        )}
      </div>

      {/* ── DESCRIPTION / NOTES ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">
            What do you need help with?
          </label>
          <span className="text-[11px] text-muted font-medium">
            {descriptionValue.length}/2000
          </span>
        </div>

        <textarea
          rows={4}
          maxLength={2000}
          placeholder="e.g. Need assistance diagnosing a kitchen sink leak, checking pipe seals, or review Next.js API architecture..."
          {...register("description")}
          className="w-full px-3.5 py-2.5 bg-white border border-border text-sm text-ink outline-none focus:border-purple resize-none placeholder:text-muted/70"
        />
        {errors.description && (
          <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1 mt-1">
            <AlertCircle className="size-3" />
            {errors.description.message}
          </p>
        )}
      </div>

      {/* ── TOKEN ESCROW GUARANTEE ── */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 p-3.5 flex items-start gap-3">
        <ShieldCheck className="size-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 leading-relaxed">
          <strong className="font-bold">Safe Token Escrow:</strong> Your {tutor.price} tokens
          are held safely by StudentXchange. They will only be transferred to {tutor.firstName} once
          the session has taken place and you confirm completion.
        </div>
      </div>

      {/* ── ACTIONS ── */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-xs font-semibold text-muted hover:text-ink transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-ink text-white px-6 py-2.5 text-xs font-semibold hover:bg-ink/85 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting Request…</span>
            </>
          ) : (
            <>
              <Calendar className="size-3.5" />
              <span>Confirm &amp; Request Booking</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
