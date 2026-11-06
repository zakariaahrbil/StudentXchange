import Link from "next/link";
import Image from "next/image";

const steps = [
  {
    num: "01",
    title: "Create your profile",
    desc: "List the skills you can teach and the ones you want to learn.",
  },
  {
    num: "02",
    title: "Match & connect",
    desc: "Discover students whose skills complement yours and reach out.",
  },
  {
    num: "03",
    title: "Exchange & earn",
    desc: "Complete skill exchanges and earn credits for every session.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-border">
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
        <div className="flex items-center gap-6">
          <Link
            href="/auth"
            className="text-sm font-medium text-muted hover:text-ink transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth?tab=register"
            className="text-sm font-semibold px-5 py-2 bg-purple text-white hover:bg-[#3d39c0] transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main className="flex flex-col flex-1">
        {/* HERO */}
        <section className="flex flex-col items-center justify-center text-center px-6 py-20 sm:py-28">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] bg-mint text-ink px-3 py-1 mb-8 inline-block">
            Student skills marketplace
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-[-0.04em] text-ink max-w-2xl mb-6">
            Exchange skills.
            <br />
            <span className="text-purple">Grow together.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted leading-relaxed max-w-md mb-10">
            Connect with students across universities. Trade your expertise,
            build new skills, and earn credits along the way.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/auth?tab=register"
              className="w-full sm:w-auto text-center text-sm font-semibold px-6 py-3 bg-purple text-white hover:bg-[#3d39c0] transition-colors"
            >
              Create account
            </Link>
            <Link
              href="/auth"
              className="w-full sm:w-auto text-center text-sm font-medium px-6 py-3 border border-border text-ink hover:bg-[#f7f7f7] transition-colors"
            >
              Sign in
            </Link>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="border-t border-border" />

        {/* HOW IT WORKS */}
        <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-faint mb-12">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={[
                  "pr-0 md:pr-8",
                  i !== 0 ? "md:pl-8 md:border-l md:border-border border-t md:border-t-0 border-border pt-6 md:pt-0" : "",
                ].join(" ")}
              >
                <span className="block text-xs font-bold text-purple mb-4">
                  {step.num}
                </span>
                <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-ink mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DIVIDER */}
        <div className="border-t border-border" />

        {/* CTA STRIP */}
        <section className="w-full max-w-5xl mx-auto px-6 sm:px-8 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-[22px] font-bold tracking-[-0.03em] text-ink mb-1">
              Ready to start exchanging?
            </h2>
            <p className="text-sm text-muted">It takes less than a minute to join.</p>
          </div>
          <Link
            href="/auth?tab=register"
            className="text-sm font-semibold px-6 py-3 bg-mint text-ink hover:brightness-95 transition-all shrink-0"
          >
            Get started free →
          </Link>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 sm:px-8 py-5 border-t border-border text-xs text-faint">
        <span>© 2026 StudentXchange</span>
        <span>Built for students, by students.</span>
      </footer>
    </div>
  );
}
