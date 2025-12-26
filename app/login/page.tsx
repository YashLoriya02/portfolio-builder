"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
                <h1 className="text-2xl font-semibold">Sign in</h1>
                <p className="mt-2 text-sm opacity-70">
                    Use GitHub to create and publish your portfolio.
                </p>

                <button
                    onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                    className="mt-6 w-full rounded-xl bg-white text-black font-medium py-3
                     hover:opacity-90 active:scale-[0.99] transition"
                >
                    Continue with GitHub
                </button>

                <div className="mt-4 text-xs opacity-60">
                    By continuing, you agree to basic terms.
                </div>
            </div>
        </main>
    );
}
