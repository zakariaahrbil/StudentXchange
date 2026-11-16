import Image from "next/image";
import React from "react";
import { AuthGuard } from "@/lib/providers/AuthGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-ink">
            <header className="h-16 border-b border-border bg-white px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2.5">
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
                </div>

                <div className="flex items-center gap-4">
                </div>
            </header>

            <div className="flex flex-1">
                <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
                    <AuthGuard>{children}</AuthGuard>
                </main>
            </div>
        </div>
    );
}
