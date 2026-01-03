"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Topbar from "./Topbar";
import { MenuIcon, X } from "lucide-react";

const nav = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/editor", label: "Editor" },
    { href: "/dashboard/templates", label: "Templates" },
    { href: "/dashboard/publish", label: "Publish" },
    { href: "/dashboard/published", label: "Published" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const indicatorRef = useRef<HTMLDivElement | null>(null);
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    const [mobileOpen, setMobileOpen] = useState(false);

    const activeIndex = useMemo(() => {
        return nav.findIndex((n) => pathname === n.href);
    }, [pathname]);

    useEffect(() => {
        if (activeIndex < 0) return;

        gsap.to(indicatorRef.current, {
            y: activeIndex * 44,
            duration: 0.35,
            ease: "power3.out",
        });
    }, [activeIndex]);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!mobileOpen) {
            document.body.style.overflow = "";
            return;
        }
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileOpen(false);
        };
        if (mobileOpen) window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [mobileOpen]);

    const SidebarContent = (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4">
                <Link href={"/"} className="font-semibold tracking-tight">
                    Portfolio Builder
                </Link>

                <button
                    className="md:hidden rounded-xl border border-white/10 bg-white/5 p-2 text-sm hover:bg-white/10 transition"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="relative px-4 pb-4">
                <div
                    ref={indicatorRef}
                    className="absolute left-4 top-0 w-[calc(100%-2rem)] h-10 rounded-xl"
                />
                <nav className="relative flex flex-col gap-1">
                    {nav.map((n) => {
                        const active = pathname === n.href;
                        return (
                            <Link
                                key={n.href}
                                href={n.href}
                                className={[
                                    "h-10 rounded-xl px-3 flex items-center",
                                    "transition hover:bg-white/5",
                                    active ? "bg-white/10 text-white" : "text-white/70",
                                ].join(" ")}
                                onClick={() => setMobileOpen(false)}
                            >
                                {n.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="fixed bottom-0 left-0 w-70 p-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-medium">Quick tip</div>
                    <div className="mt-1 text-xs opacity-70">
                        Start with your resume → we&apos;ll auto-fill sections.
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="hidden md:grid min-h-screen grid-cols-[280px_1fr]">
                <aside className="border-r border-white/10">
                    {SidebarContent}
                </aside>

                <section className="min-h-screen overflow-y-auto">
                    <Topbar />
                    <div className="px-6 py-6">{children}</div>
                </section>
            </div>

            <div className="md:hidden min-h-screen">
                <div className="sticky top-0 z-30 bg-black/70 backdrop-blur border-b border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-sm hover:bg-white/10 transition"
                            aria-label="Open menu"
                        >
                            <MenuIcon className="h-5 w-5" />
                        </button>
                        <div className="flex-1 min-w-0">
                            <Topbar />
                        </div>
                    </div>
                </div>

                <div className="px-4 py-4">{children}</div>

                <div
                    className={[
                        "fixed inset-0 z-40 bg-black/60 transition-opacity",
                        mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
                    ].join(" ")}
                    onClick={() => setMobileOpen(false)}
                />

                <aside
                    ref={sidebarRef}
                    className={[
                        "fixed left-0 top-0 z-50 h-dvh w-[82vw] max-w-[320px] border-r border-white/10 bg-black",
                        "transform transition-transform duration-300 ease-out",
                        mobileOpen ? "translate-x-0" : "-translate-x-full",
                    ].join(" ")}
                    aria-hidden={!mobileOpen}
                >
                    {SidebarContent}
                </aside>
            </div>
        </div>
    );
}
