"use client";

import { Github, Lock, Rocket, Code } from "lucide-react";
import { signIn } from "next-auth/react";

function Step({
    icon,
    title,
    desc,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) {
    return (
        <div className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                {icon}
            </div>
            <div>
                <div className="text-sm font-medium">{title}</div>
                <div className="text-xs text-white/60 leading-relaxed">
                    {desc}
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4 bg-black text-white">
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute -top-40 left-1/2 h-105 w-105 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-50 -right-50 h-105 w-105 rounded-full bg-white/10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl py-8 px-16 shadow-2xl">
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Secure GitHub sign-in
                    </div>

                    <h1 className="mt-4 text-2xl font-semibold tracking-tight">
                        Sign in to publish your portfolio
                    </h1>
                    <p className="mt-2 text-sm text-white/60">
                        We use GitHub to create a repository and give you full
                        ownership of your portfolio code.
                    </p>
                </div>

                {/* Why GitHub */}
                <div className="space-y-4 mb-6">
                    <Step
                        icon={<Code size={16} />}
                        title="You own the code"
                        desc="Your portfolio is created as a public GitHub repo that you can edit anytime."
                    />
                    <Step
                        icon={<Rocket size={16} />}
                        title="One-click deployment"
                        desc="Deploy instantly to Vercel with zero configuration."
                    />
                    <Step
                        icon={<Lock size={16} />}
                        title="Read-only access"
                        desc="We never modify anything without your action. No private repos touched."
                    />
                </div>

                {/* CTA */}
                <button
                    onClick={() =>
                        signIn("github", { callbackUrl: "/dashboard" })
                    }
                    className="w-full rounded-xl bg-white text-black font-medium py-3 hover:opacity-90 active:scale-[0.99] transition flex items-center gap-3 justify-center"
                >
                    <Github />
                    Continue with GitHub
                </button>

                {/* Footer note */}
                <div className="mt-4 text-center text-xs text-white/50 leading-relaxed">
                    By continuing, you allow us to create a public repository
                    under your GitHub account.
                    <br />
                    No spam. No hidden permissions.
                </div>
            </div>
        </main>
    );
}
