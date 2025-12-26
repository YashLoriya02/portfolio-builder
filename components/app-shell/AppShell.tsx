"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import Topbar from "./Topbar";

const nav = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/editor", label: "Editor" },
    { href: "/dashboard/templates", label: "Templates" },
    // { href: "/dashboard/publish", label: "Publish" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const indicatorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const activeIndex = nav.findIndex((n) => pathname === n.href);
        if (activeIndex < 0) return;

        gsap.to(indicatorRef.current, {
            y: activeIndex * 44,
            duration: 0.35,
            ease: "power3.out",
        });
    }, [pathname]);

    return (
        <div className="min-h-screen grid grid-cols-[280px_1fr] bg-black text-white">
            <aside className="border-r border-white/10 p-4">
                <div className="flex items-center justify-between">
                    <div className="font-semibold tracking-tight">Portfolio Builder</div>
                </div>

                <div className="relative mt-6">
                    <div
                        ref={indicatorRef}
                        className="absolute left-0 top-0 w-full h-10 rounded-xl bg-white/10"
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
                                        active ? "text-white" : "text-white/70",
                                    ].join(" ")}
                                >
                                    {n.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-medium">Quick tip</div>
                    <div className="mt-1 text-xs opacity-70">
                        Start with your resume → we'll auto-fill sections.
                    </div>
                </div>
            </aside>

            <section className="min-h-screen overflow-y-auto">
                <Topbar />
                <div className="px-6 py-6">{children}</div>
            </section>
        </div>
    );
}
