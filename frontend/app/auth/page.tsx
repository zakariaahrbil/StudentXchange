"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

function AuthPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") === "register" ? "register" : "login";

  function switchTab(nextTab: "login" | "register") {
    router.replace(nextTab === "register" ? "/auth?tab=register" : "/auth");
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      <aside className="hidden lg:flex w-[420px] shrink-0 bg-purple flex-col justify-between p-12 text-white">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.jpg"
            alt="StudentXchange"
            width={28}
            height={28}
            className="block"
            priority
          />
          <span className="text-sm font-semibold tracking-[-0.02em]">
            StudentXchange
          </span>
        </Link>

        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] mb-4">
            Exchange skills.
            <br />
            <span className="text-mint">Grow together.</span>
          </h2>
          <p className="text-sm text-white/70 leading-relaxed max-w-xs">
            Join students trading expertise and earning credits across universities worldwide.
          </p>
        </div>

        <span className="text-xs text-white/40 tracking-wider">
          © 2026 StudentXchange
        </span>
      </aside>

      <main className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 bg-white">
        <div className="w-full max-w-sm flex flex-col">
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8">
            <Image
              src="/logo.jpg"
              alt="StudentXchange"
              width={26}
              height={26}
              priority
            />
            <span className="text-sm font-semibold tracking-[-0.02em] text-ink">
              StudentXchange
            </span>
          </Link>

          <div className="flex border-b border-border mb-8">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`pb-3 mr-6 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
                tab === "login"
                  ? "text-purple border-purple"
                  : "text-faint hover:text-ink border-transparent"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => switchTab("register")}
              className={`pb-3 mr-6 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
                tab === "register"
                  ? "text-purple border-purple"
                  : "text-faint hover:text-ink border-transparent"
              }`}
            >
              Register
            </button>
          </div>

          {/* HEADING */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-[-0.03em] text-ink mb-1.5">
              {tab === "login" ? "Welcome back." : "Create your account."}
            </h1>
            <p className="text-sm text-faint">
              {tab === "login"
                ? "Sign in to continue to StudentXchange."
                : "Start exchanging skills today."}
            </p>
          </div>

          {tab === "login" ? (
            <LoginForm />
          ) : (
            <RegisterForm onSuccessRedirect={() => switchTab("login")} />
          )}

          <div className="mt-8 text-xs text-faint">
            {tab === "login" ? (
              <p>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("register")}
                  className="font-semibold text-purple hover:underline cursor-pointer"
                >
                  Register
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className="font-semibold text-purple hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthPageInner />
    </Suspense>
  );
}
