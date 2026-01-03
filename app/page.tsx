import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const runtime = "nodejs";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70">
      {children}
    </span>
  );
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  console.log("Session: ", session)
  const isAuthed = Boolean(session);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-[30%] -left-40 h-105 w-105 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-55 -right-55 h-130 w-130 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            ⚡
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Portfolio Builder
          </span>
        </Link>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Resume → Portfolio → GitHub → Vercel
            </div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Build a portfolio website in minutes.
            </h1>

            <p className="max-w-xl text-sm leading-7 text-white/70 md:text-base">
              Upload your resume, choose a dark template, and publish a full
              editable codebase into your GitHub — then deploy with one click.
              No web-dev knowledge needed.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {!isAuthed ? (
                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 active:scale-[0.99]"
                >
                  <span>Continue with GitHub</span>
                  <span className="ml-2 transition group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 active:scale-[0.99]"
                >
                  <span>Go to Dashboard</span>
                  <span className="ml-2 transition group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
              )}

              <Link
                href="/dashboard/templates"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                Explore Templates
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Pill>Public repo by default</Pill>
              <Pill>Single-page portfolio</Pill>
              <Pill>Editable JSON data</Pill>
              <Pill>Fast deploy</Pill>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">How it works</div>
                <div className="mt-1 text-xs text-white/60">
                  Simple steps, clean output.
                </div>
              </div>
              <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70">
                {isAuthed ? "Signed in ✅" : "Not signed in"}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  n: "01",
                  t: "Upload resume",
                  d: "We extract your data (name, skills, projects, etc.).",
                },
                {
                  n: "02",
                  t: "Pick a template",
                  d: "Minimal / Glass / Neo / Classic — all dark.",
                },
                {
                  n: "03",
                  t: "Edit content",
                  d: "Fine-tune in the editor, preview live.",
                },
                {
                  n: "04",
                  t: "Publish",
                  d: "Repo is created in your GitHub with full code.",
                },
                {
                  n: "05",
                  t: "Deploy",
                  d: "Click Deploy to Vercel. Done.",
                },
              ].map((s) => (
                <div
                  key={s.n}
                  className="group flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:bg-white/6"
                >
                  <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs text-white/70">
                    {s.n}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{s.t}</div>
                    <div className="mt-1 text-xs text-white/60">{s.d}</div>
                  </div>
                  <div className="ml-auto opacity-0 transition group-hover:opacity-100 text-white/40">
                    →
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="text-sm font-medium text-emerald-200">
                You own the code.
              </div>
              <div className="mt-1 text-xs text-emerald-200/70">
                The generated repo is editable — change content anytime and
                redeploy.
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-10 text-sm text-white/50">
        <div className={`flex flex-col gap-2 sm:flex-row sm:items-center ${isAuthed ? "sm:justify-between" : "sm:justify-center"}`}>
          <div>© {new Date().getFullYear()} Portfolio Builder - All Rights Reserved</div>
          {
            isAuthed &&
            <div className="flex gap-3">
              <Link className="hover:text-white/70" href="/dashboard/templates">
                Templates
              </Link>
              <Link className="hover:text-white/70" href="/dashboard/editor">
                Editor
              </Link>
              <Link className="hover:text-white/70" href="/dashboard/publish">
                Publish
              </Link>
            </div>
          }
        </div>
      </footer>
    </main>
  );
}
