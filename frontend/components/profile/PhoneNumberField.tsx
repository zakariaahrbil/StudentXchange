"use client";

import { useState } from "react";
import { Phone, Mail, Check, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profilePhoneSchema,
  type ProfilePhoneInput,
} from "@/lib/validations/profile";
import { useAuthStore } from "@/lib/hooks/useAuthStore";

interface PhoneNumberFieldProps {
  initialPhoneNumber?: string | null;
  email?: string | null;
}

export default function PhoneNumberField({
  initialPhoneNumber,
  email,
}: PhoneNumberFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const user = useAuthStore((state) => state.userProfile);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfilePhoneInput>({
    resolver: zodResolver(profilePhoneSchema),
    defaultValues: {
      phoneNumber: initialPhoneNumber ?? "",
    },
  });

  const onSubmit = (data: ProfilePhoneInput) => {
    if (user) {
      // Optimistically update the in-memory user profile
      const updatedProfile = {
        ...user,
        phoneNumber: data.phoneNumber || null,
      };
      setUserProfile(updatedProfile);
    }

    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCancel = () => {
    reset({ phoneNumber: initialPhoneNumber ?? "" });
    setIsEditing(false);
  };

  const displayPhone = user?.phoneNumber || initialPhoneNumber;

  return (
    <div className="flex flex-col gap-4">
      {/* ── HEADER & ALWAYS-VISIBLE BADGE ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Direct Peer Contact
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-mint/20 text-ink px-2 py-0.5 rounded-full border border-mint/40">
            Always Visible to Peers
          </span>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs font-semibold text-purple hover:underline self-start sm:self-auto cursor-pointer"
          >
            {displayPhone ? "Edit Phone Number" : "+ Add Phone Number"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ── EMAIL CONTACT (ALWAYS VISIBLE) ── */}
        <div className="bg-[#FAFAFA] border border-border p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              <Mail className="size-3.5 text-muted" />
              <span>Email Address</span>
            </div>
            <div className="text-sm font-bold text-ink break-all">
              {email ?? "—"}
            </div>
          </div>

          {email && (
            <div className="mt-3 pt-2.5 border-t border-border/60">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline"
              >
                <span>Send Email</span>
                <span>→</span>
              </a>
            </div>
          )}
        </div>

        {/* ── PHONE CONTACT (ALWAYS VISIBLE) ── */}
        <div className="bg-[#FAFAFA] border border-border p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              <Phone className="size-3.5 text-muted" />
              <span>Phone / WhatsApp</span>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-2">
                <input
                  type="tel"
                  placeholder="+1 555-0199 or 0612345678"
                  {...register("phoneNumber")}
                  className="w-full px-3 py-1.5 bg-white border border-border text-sm text-ink outline-none focus:border-purple"
                />
                {errors.phoneNumber && (
                  <p className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {errors.phoneNumber.message}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-ink text-white text-xs font-semibold px-3 py-1.5 hover:bg-ink/85 transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-xs font-semibold text-muted hover:text-ink px-2 py-1.5 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-sm font-bold text-ink">
                {displayPhone ? (
                  displayPhone
                ) : (
                  <span className="text-muted font-normal italic">
                    No phone number added yet
                  </span>
                )}
              </div>
            )}
          </div>

          {!isEditing && displayPhone && (
            <div className="mt-3 pt-2.5 border-t border-border/60">
              <a
                href={`tel:${displayPhone}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline"
              >
                <span>Call / Text</span>
                <span>→</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2">
          <Check className="size-3.5 text-emerald-700" />
          <span>Phone number updated successfully.</span>
        </div>
      )}
    </div>
  );
}
