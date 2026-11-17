"use client"

import React, { useEffect } from "react"
import { useAuthStore } from "../hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoading = useAuthStore((state) => state.isLoading);
    const router = useRouter();


    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(`/auth?tab=login`);
        }
    }, [isLoading, isAuthenticated, router]);


    if (isLoading || !isAuthenticated) {
        return <Loading />;
    }

    return (
        <>
            {children}
        </>
    )


}