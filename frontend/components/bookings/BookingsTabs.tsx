"use client";

import { CalendarCheck, Inbox } from "lucide-react";

interface BookingsTabsProps {
  activeTab: "learner" | "tutor";
  onTabChange: (tab: "learner" | "tutor") => void;
  learnerCount: number;
  tutorCount: number;
}

export default function BookingsTabs({
  activeTab,
  onTabChange,
  learnerCount,
  tutorCount,
}: BookingsTabsProps) {
  return (
    <div className="flex items-center gap-2 border-b border-border pb-px overflow-x-auto">
      <button
        type="button"
        onClick={() => onTabChange("learner")}
        className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
          activeTab === "learner"
            ? "border-ink text-ink font-bold"
            : "border-transparent text-muted hover:text-ink hover:border-border"
        }`}
      >
        <CalendarCheck className="size-3.5" />
        <span>My Bookings</span>
        <span
          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
            activeTab === "learner"
              ? "bg-ink text-white"
              : "bg-slate-100 text-muted"
          }`}
        >
          {learnerCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("tutor")}
        className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
          activeTab === "tutor"
            ? "border-ink text-ink font-bold"
            : "border-transparent text-muted hover:text-ink hover:border-border"
        }`}
      >
        <Inbox className="size-3.5" />
        <span>Incoming Requests</span>
        <span
          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
            activeTab === "tutor"
              ? "bg-ink text-white"
              : "bg-slate-100 text-muted"
          }`}
        >
          {tutorCount}
        </span>
      </button>
    </div>
  );
}
