"use client";

import { useState } from "react";
import Link from "next/link";
import BookingsTabs from "@/components/bookings/BookingsTabs";
import BookingCard from "@/components/bookings/BookingCard";
import {
  useUserBookings,
  useAcceptBooking,
  useRejectBooking,
  useCompleteBooking,
  useCancelBooking,
} from "@/lib/hooks/useBookings";
import { useAuthStore } from "@/lib/hooks/useAuthStore";
import { getApiErrorMessage } from "@/lib/errors";
import type { Booking } from "@/lib/types";
import { Calendar, Search, ArrowRight } from "lucide-react";

// Initial realistic samples for immediate UI testing & demonstration
const INITIAL_DEMO_BOOKINGS: Booking[] = [
  {
    id: "book-sample-1",
    buyerId: "u-current",
    skillId: "sk-1",
    skillOwnerId: "u-101",
    skillName: "React & Next.js Architecture Review",
    price: 15,
    realizationAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    status: "ACCEPTED",
    createdAt: new Date().toISOString(),
    description: "Review component architecture, server actions, and query cache setup.",
  },
  {
    id: "book-sample-2",
    buyerId: "u-current",
    skillId: "sk-2",
    skillOwnerId: "u-102",
    skillName: "Plumbing Leak Inspection & Pipe Repair",
    price: 18,
    realizationAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    status: "PENDING",
    createdAt: new Date().toISOString(),
    description: "Kitchen sink has slow leak under the cabinet, need help checking the trap valve.",
  },
  {
    id: "book-sample-3",
    buyerId: "u-205",
    skillId: "sk-my-1",
    skillOwnerId: "u-current",
    skillName: "Apartment Moving & Furniture Assembly",
    price: 16,
    realizationAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: "PENDING",
    createdAt: new Date().toISOString(),
    description: "Need help assembling a desk and moving a mattress to the 2nd floor.",
  },
  {
    id: "book-sample-4",
    buyerId: "u-current",
    skillId: "sk-3",
    skillOwnerId: "u-103",
    skillName: "UI/UX & Figma Design Systems",
    price: 12,
    realizationAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    description: "Design review for dashboard navigation and responsive card layouts.",
  },
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<"learner" | "tutor">("learner");
  const [localBookings, setLocalBookings] = useState<Booking[]>(INITIAL_DEMO_BOOKINGS);
  const [actionError, setActionError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.userProfile);
  const currentUserId = user?.id ?? "u-current";

  const { data: serverBookings = [], isLoading, isError } = useUserBookings();

  // Mutations
  const { mutate: acceptBooking, isPending: isAccepting } = useAcceptBooking();
  const { mutate: rejectBooking, isPending: isRejecting } = useRejectBooking();
  const { mutate: completeBooking, isPending: isCompleting } = useCompleteBooking();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  const isActionPending = isAccepting || isRejecting || isCompleting || isCancelling;

  // Use live server bookings when query succeeds; fallback to offline demo only if network fails
  const allBookings = isError ? localBookings : serverBookings;

  // Filter based on tab:
  // "learner": bookings made by the current user
  // "tutor": incoming requests for the current user's skills
  const learnerBookings = allBookings.filter(
    (b) => b.buyerId === currentUserId || (isError && b.buyerId === "u-current")
  );
  const tutorBookings = allBookings.filter(
    (b) => b.skillOwnerId === currentUserId || (isError && b.skillOwnerId === "u-current")
  );

  const displayedBookings = activeTab === "learner" ? learnerBookings : tutorBookings;

  // Handlers with local state fallback for offline resilience
  const handleAccept = (bookingId: string) => {
    setActionError(null);
    acceptBooking(bookingId, {
      onError: (err) => {
        if (isError) {
          setLocalBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? { ...b, status: "ACCEPTED" } : b))
          );
        } else {
          setActionError(getApiErrorMessage(err, "Failed to accept booking."));
        }
      },
    });
  };

  const handleReject = (bookingId: string) => {
    setActionError(null);
    rejectBooking(bookingId, {
      onError: (err) => {
        if (isError) {
          setLocalBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? { ...b, status: "REJECTED" } : b))
          );
        } else {
          setActionError(getApiErrorMessage(err, "Failed to reject booking."));
        }
      },
    });
  };

  const handleComplete = (bookingId: string) => {
    setActionError(null);
    completeBooking(bookingId, {
      onError: (err) => {
        if (isError) {
          setLocalBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? { ...b, status: "COMPLETED" } : b))
          );
        } else {
          setActionError(getApiErrorMessage(err, "Failed to mark booking completed."));
        }
      },
    });
  };

  const handleCancel = (bookingId: string) => {
    setActionError(null);
    cancelBooking(bookingId, {
      onError: (err) => {
        if (isError) {
          setLocalBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? { ...b, status: "CANCELLED" } : b))
          );
        } else {
          setActionError(getApiErrorMessage(err, "Failed to cancel booking."));
        }
      },
    });
  };

  // Stats calculation
  const inProgressCount = allBookings.filter((b) => b.status === "ACCEPTED").length;
  const pendingCount = allBookings.filter((b) => b.status === "PENDING").length;
  const totalEscrowTokens = allBookings
    .filter((b) => b.status === "PENDING" || b.status === "ACCEPTED")
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* ── HEADER ── */}
      <section className="bg-white border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-mint text-ink px-2.5 py-1 inline-block mb-3">
            Sessions
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Bookings &amp; Requests
          </h1>
          <p className="text-sm text-muted mt-1">
            Track scheduled peer services, manage incoming requests, and coordinate with campus peers.
          </p>
        </div>

        <Link
          href="/dashboard/explore"
          className="inline-flex items-center gap-2 bg-ink text-white px-4 py-2.5 text-xs font-semibold hover:bg-ink/85 transition-colors shrink-0"
        >
          <Search className="size-3.5" />
          <span>Explore Skills</span>
        </Link>
      </section>

      {/* ── CLEAN STATS SUMMARY (MINIMALIST MONOCHROME) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-border p-5">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted">
            Pending Requests
          </div>
          <div className="text-2xl font-bold text-ink mt-1">
            {pendingCount}
          </div>
          <p className="text-xs text-muted mt-1">Awaiting acceptance</p>
        </div>

        <div className="bg-white border border-border p-5">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted">
            Active In Progress
          </div>
          <div className="text-2xl font-bold text-ink mt-1">
            {inProgressCount}
          </div>
          <p className="text-xs text-muted mt-1">Services accepted &amp; scheduled</p>
        </div>

        <div className="bg-white border border-border p-5">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted">
            Tokens in Escrow
          </div>
          <div className="text-2xl font-bold text-ink mt-1">
            {totalEscrowTokens} <span className="text-xs font-normal text-muted">Tokens</span>
          </div>
          <p className="text-xs text-muted mt-1">Protected until completion</p>
        </div>
      </div>

      {/* ── ACTION ERROR ALERT ── */}
      {actionError && (
        <div className="bg-rose-50 border border-rose-200 p-3.5 flex items-center justify-between gap-3 text-xs text-rose-800">
          <span>{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-rose-600 hover:text-rose-900 font-bold ml-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* ── OFFLINE DEMO NOTICE ── */}
      {isError && (
        <div className="bg-slate-100 border border-border p-3 text-xs text-muted flex items-center justify-between">
          <span>Backend offline or unreachable. Displaying local fallback session data.</span>
        </div>
      )}

      {/* ── TABS ── */}
      <BookingsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        learnerCount={learnerBookings.length}
        tutorCount={tutorBookings.length}
      />

      {/* ── BOOKINGS LIST ── */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-mint border-t-transparent rounded-full animate-spin" />
          </div>
        ) : displayedBookings.length === 0 ? (
          <div className="bg-white border border-border p-12 text-center flex flex-col items-center justify-center">
            <Calendar className="size-8 text-muted mb-3" />
            <h3 className="text-base font-bold text-ink">
              {activeTab === "learner"
                ? "No services booked yet"
                : "No incoming requests yet"}
            </h3>
            <p className="text-xs text-muted mt-1 max-w-sm">
              {activeTab === "learner"
                ? "Explore available campus peers to book your first skill or assistance exchange."
                : "When peers book your skills from the marketplace, their requests will appear here."}
            </p>

            {activeTab === "learner" && (
              <Link
                href="/dashboard/explore"
                className="mt-6 inline-flex items-center gap-2 bg-mint text-ink text-xs font-semibold px-5 py-2.5 hover:bg-mint/80 transition-colors"
              >
                <span>Explore Skills</span>
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </div>
        ) : (
          displayedBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              role={activeTab}
              onAccept={handleAccept}
              onReject={handleReject}
              onComplete={handleComplete}
              onCancel={handleCancel}
              isActionPending={isActionPending}
            />
          ))
        )}
      </div>
    </div>
  );
}
