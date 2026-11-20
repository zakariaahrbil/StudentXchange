import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AuthGuard } from "@/lib/providers/AuthGuard";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import FloatingNavbar from "@/components/dashboard/FloatingNavbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen flex flex-col bg-[#FAFAFA] text-ink overflow-hidden relative">
            {/* ── FLOATING TOP BAR (FIXED ABOVE SCROLLING CONTENT) ── */}
            <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 sm:px-6 z-40 pointer-events-none">
                <header className="h-13 sm:h-14 bg-white/90 backdrop-blur-md border border-border rounded-full px-4 sm:px-6 flex items-center justify-between shadow-xs pointer-events-auto">
                    <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Image
                            src="/logo.jpg"
                            alt="StudentXchange"
                            width={32}
                            height={32}
                            className="rounded-full"
                            priority
                        />
                        <span className="text-sm font-semibold tracking-[-0.02em] text-ink">
                            StudentXchange
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <ProfileDropdown />
                    </div>
                </header>
            </div>

            {/* ── SCROLLABLE MAIN CONTENT (FLOWS UNDER TOP BAR) ── */}
            <main className="flex-1 overflow-y-auto pt-20 sm:pt-24 px-4 sm:px-6 sm:px-8 pb-28">
                <div className="max-w-7xl mx-auto w-full">
                    <AuthGuard>{children}</AuthGuard>
                </div>
            </main>

            <FloatingNavbar />
        </div>
    );
}
