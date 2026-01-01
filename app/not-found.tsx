"use client"

import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-dvh flex items-center justify-center px-4 py-10">
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-black" />
                <div className="absolute -bottom-30 -right-30 h-105 w-105 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.10),transparent_55%)]" />
            </div>

            <div className="w-full max-w-3xl">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />

                    <div className="p-7 md:p-10">
                        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/70">
                                    <span className="inline-block h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                                    Page not found
                                </div>

                                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                                    404 — Lost in the void
                                </h1>

                                <p className="text-white/65 max-w-xl">
                                    The page you’re trying to open doesn’t exist, or it moved.
                                    Use the shortcuts below to get back on track.
                                </p>
                            </div>
                        </div>

                        <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Link
                                href="/"
                                className="group rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition"
                            >
                                <div className="text-sm font-medium flex items-center justify-between">
                                    Go Home
                                    <span className="text-white/50 group-hover:translate-x-0.5 transition">
                                        →
                                    </span>
                                </div>
                                <div className="mt-1 text-xs text-white/60">
                                    Back to landing page
                                </div>
                            </Link>

                            <Link
                                href="/dashboard"
                                className="group rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition"
                            >
                                <div className="text-sm font-medium flex items-center justify-between">
                                    Dashboard
                                    <span className="text-white/50 group-hover:translate-x-0.5 transition">
                                        →
                                    </span>
                                </div>
                                <div className="mt-1 text-xs text-white/60">
                                    Continue building your portfolio
                                </div>
                            </Link>
                        </div>

                        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                            <div className="text-xs text-white/60">Quick tip</div>
                            <div className="mt-1 text-sm text-white/75">
                                If you typed the URL manually, double-check it. Otherwise, jump to{" "}
                                <span className="text-white">Dashboard → Templates → Publish</span>.
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white/5 to-transparent pointer-events-none" />
                </div>

                <div className="mt-4 text-center text-xs text-white/40">
                    Portfolio Builder
                </div>
            </div>
        </main>
    );
}
