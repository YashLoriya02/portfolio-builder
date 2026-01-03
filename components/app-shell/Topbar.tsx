"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

function getFirstName(name?: string | null) {
    if (!name) return null;
    return name.trim().split(" ")[0] || name;
}

export default function Topbar() {
    const { data } = useSession();

    const first = getFirstName(data?.user?.name);

    return (
        <div className="sticky top-0 z-20 md:backdrop-blur-xl md:bg-black/40 md:border-b border-white/10">
            <div className="flex items-center justify-between px-3 md:px-6 py-4">
                <div>
                    <div className="text-sm text-white/60">Welcome back</div>
                    <div className="text-base md:text-xl font-semibold tracking-tight">
                        {first ? `Hi, ${first.charAt(0).toUpperCase() + first.substring(1)} 👋` : "Hi 👋"}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="text-xs text-white/70">Logged in</span>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem("pb_app_jwt");
                            localStorage.removeItem("pb_user_id");

                            signOut({ callbackUrl: "/" })
                        }}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm
                       hover:bg-white/10 transition active:scale-[0.99]"
                    >
                        Sign out
                    </button>

                    <div className="h-8 w-8 md:h-10 md:w-10 overflow-hidden rounded-full border border-white/10 bg-white/5">
                        <img
                            src={data?.user?.image ?? "https://avatars.githubusercontent.com/u/583231?v=4"}
                            alt="avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
