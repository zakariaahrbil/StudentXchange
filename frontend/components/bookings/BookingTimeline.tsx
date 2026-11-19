"use client";

import type { BookingStatus } from "@/lib/types";
import { Check } from "lucide-react";

interface BookingTimelineProps {
  status: BookingStatus;
}

export default function BookingTimeline({ status }: BookingTimelineProps) {
  if (status === "CANCELLED" || status === "REJECTED") {
    return (
      <div className="py-2 text-xs text-muted border border-border px-3 bg-slate-50">
        <span>
          {status === "CANCELLED"
            ? "Session cancelled — Tokens have been refunded to wallet balance."
            : "Request declined by peer — Tokens refunded to wallet balance."}
        </span>
      </div>
    );
  }

  // 1: PENDING, 2: ACCEPTED, 3: COMPLETED
  let currentStep = 1;
  if (status === "ACCEPTED") currentStep = 2;
  if (status === "COMPLETED") currentStep = 3;

  const steps = [
    { num: 1, label: "Requested" },
    { num: 2, label: "In Progress" },
    { num: 3, label: "Completed" },
  ];

  return (
    <div className="w-full flex flex-col gap-2 pt-3 border-t border-border">
      <div className="flex items-center justify-between text-xs">
        {steps.map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <div
              key={step.num}
              className={`flex items-center gap-1.5 ${
                isDone || isCurrent ? "text-ink font-semibold" : "text-muted"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isDone
                    ? "bg-ink text-white"
                    : isCurrent
                    ? "bg-mint text-ink border border-ink"
                    : "bg-slate-100 text-muted border border-border"
                }`}
              >
                {isDone ? <Check className="size-2.5 stroke-[3]" /> : step.num}
              </div>
              <span className="hidden sm:inline">{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden flex">
        <div
          className={`h-full transition-all duration-300 ${
            currentStep === 1
              ? "w-1/3 bg-muted"
              : currentStep === 2
              ? "w-2/3 bg-mint"
              : "w-full bg-ink"
          }`}
        />
      </div>
    </div>
  );
}
