import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AuthGuard } from "@/lib/providers/AuthGuard";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen flex flex-col bg-[#FAFAFA] text-ink overflow-hidden">
            <header className="h-16 shrink-0 w-full border-b border-border bg-white px-6 sm:px-8 flex items-center justify-between z-40">
                <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                    <Image
                        src="/logo.jpg"
                        alt="StudentXchange"
                        width={40}
                        height={40}
                        priority
                    />
                    <span className="text-[15px] font-semibold tracking-[-0.02em] text-ink">
                        StudentXchange
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <ProfileDropdown />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 sm:p-8">
                <div className="max-w-7xl mx-auto w-full">
                    <AuthGuard>{children}</AuthGuard>
                </div>
            </main>
        </div>
    );
}
