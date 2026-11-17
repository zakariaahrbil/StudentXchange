"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Plus,
  ClipboardList,
  History,
} from "lucide-react";

export default function FloatingNavbar() {
  const pathname = usePathname();

  const isHome = pathname === "/dashboard";
  const isRequests = pathname === "/dashboard/requests";
  const isNew = pathname === "/dashboard/requests/new";
  const isMyDemands = pathname === "/dashboard/my-requests";
  const isHistory = pathname === "/dashboard/history";

  return (
    <nav
      aria-label="Dashboard navigation"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md border border-border shadow-2xl rounded-full px-3 py-1.5 flex items-center gap-1 sm:gap-2"
    >
      {/* ── 1. HOME ── */}
      <Link
        href="/dashboard"
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition-all ${
          isHome
            ? "bg-ink text-white shadow-sm"
            : "text-muted hover:text-ink hover:bg-slate-100"
        }`}
      >
        <LayoutDashboard className="size-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {/* ── 2. REQUESTS FEED ── */}
      <Link
        href="/dashboard/requests"
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition-all ${
          isRequests
            ? "bg-ink text-white shadow-sm"
            : "text-muted hover:text-ink hover:bg-slate-100"
        }`}
      >
        <Inbox className="size-4" />
        <span className="hidden sm:inline">Requests</span>
      </Link>

      {/* ── 3. POST REQUEST (BIG CENTER FAB) ── */}
      <div className="relative px-1 -my-3 flex items-center justify-center">
        <Link
          href="/dashboard/requests/new"
          aria-label="Create new skill request"
          className={`size-12 sm:size-13 rounded-full flex items-center justify-center bg-mint text-ink shadow-lg ring-4 ring-white hover:scale-105 active:scale-95 transition-transform ${
            isNew ? "ring-2 ring-ink ring-offset-2 bg-mint/90" : "hover:bg-mint/85"
          }`}
        >
          <Plus className="size-6 stroke-[2.5]" />
        </Link>
      </div>

      {/* ── 4. MY DEMANDS & REQUESTS ── */}
      <Link
        href="/dashboard/my-requests"
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition-all ${
          isMyDemands
            ? "bg-ink text-white shadow-sm"
            : "text-muted hover:text-ink hover:bg-slate-100"
        }`}
      >
        <ClipboardList className="size-4" />
        <span className="hidden sm:inline">Demands</span>
      </Link>

      {/* ── 5. HISTORY ── */}
      <Link
        href="/dashboard/history"
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition-all ${
          isHistory
            ? "bg-ink text-white shadow-sm"
            : "text-muted hover:text-ink hover:bg-slate-100"
        }`}
      >
        <History className="size-4" />
        <span className="hidden sm:inline">History</span>
      </Link>
    </nav>
  );
}
