"use client";

import type { BookingStatus } from "@/lib/types";
import { Check, XCircle } from "lucide-react";

interface BookingTimelineProps {
  status: BookingStatus;
}

export default function BookingTimeline({ status }: BookingTimelineProps) {
  if (status === "CANCELLED" || status === "REJECTED") {
    return (
      <div className="flex items-center gap-2 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3">
        <XCircle className="size-4 shrink-0" />
        <span>
          {status === "CANCELLED"
            ? "Session Cancelled — Tokens have been refunded to learner balance."
            : "Session Declined by Tutor — Tokens refunded to learner balance."}
        </span>
      </div>
    );
  }

  // 1: PENDING, 2: ACCEPTED, 3: COMPLETED
  let currentStep = 1;
  if (status === "ACCEPTED") currentStep = 2;
  if (status === "COMPLETED") currentStep = 3;

  const steps = [
    { num: 1, label: "1. Requested" },
    { num: 2, label: "2. Accepted & In Progress" },
    { num: 3, label: "3. Completed & Transferred" },
  ];

  return (
    <div className="w-full flex flex-col gap-2 pt-3 border-t border-border">
      <div className="flex items-center justify-between text-xs font-semibold">
        {steps.map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <div
              key={step.num}
              className={`flex items-center gap-1.5 ${
                isDone
                  ? "text-emerald-700"
                  : isCurrent
                  ? "text-ink font-bold"
                  : "text-muted"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isDone
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                    ? "bg-mint text-ink ring-2 ring-ink ring-offset-1"
                    : "bg-slate-200 text-muted"
                }`}
              >
                {isDone ? <Check className="size-2.5 stroke-[3]" /> : step.num}
              </div>
              <span className="hidden sm:inline">{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
        <div
          className={`h-full transition-all duration-300 ${
            currentStep === 1
              ? "w-1/3 bg-amber-400"
              : currentStep === 2
              ? "w-2/3 bg-mint"
              : "w-full bg-emerald-600"
          }`}
        />
      </div>
    </div>
  );
}
