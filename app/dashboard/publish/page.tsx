"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";

/** -----------------------------
 * Small UI primitives (match your dark UI)
 * ----------------------------- */
function SectionCard({
    title,
    subtitle,
    right,
    children,
}: {
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-lg font-semibold">{title}</div>
                    {subtitle ? (
                        <div className="mt-1 text-sm text-white/60">{subtitle}</div>
                    ) : null}
                </div>
                {right}
            </div>
            <div className="mt-5">{children}</div>
        </div>
    );
}

function Input({
    label,
    value,
    onChange,
    placeholder,
    hint,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    hint?: string;
}) {
    return (
        <label className="block">
            <div className="text-xs text-white/60 mb-2">{label}</div>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none
                   focus:ring-2 focus:ring-white/10"
            />
            {hint ? <div className="mt-2 text-xs text-white/50">{hint}</div> : null}
        </label>
    );
}

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70">
            {children}
        </span>
    );
}

function Spinner() {
    return (
        <div
            className="h-5 w-5 rounded-full border border-white/25 border-t-white/80 animate-spin"
            aria-hidden
        />
    );
}

const LOADER_STEPS = [
    { t: "Checking your draft", d: "Making sure your portfolio has enough content…" },
    { t: "Preparing your template", d: "Bundling your selected template + config…" },
    { t: "Creating GitHub repository", d: "Generating a new repo from the template…" },
    { t: "Injecting your resume data", d: "Writing your draft.json into the repo…" },
    { t: "Finishing touches", d: "Almost done — getting your links ready…" },
];

function PublishProgress({
    activeIndex,
    title,
    desc,
}: {
    activeIndex: number;
    title: string;
    desc: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-start gap-3">
                <Spinner />
                <div className="min-w-0">
                    <div className="text-sm font-medium">{title}</div>
                    <div className="mt-1 text-xs text-white/60">{desc}</div>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                {LOADER_STEPS.map((s, idx) => {
                    const done = idx < activeIndex;
                    const active = idx === activeIndex;
                    return (
                        <div key={s.t} className="flex items-center gap-3">
                            <div
                                className={[
                                    "h-2.5 w-2.5 rounded-full",
                                    done ? "bg-emerald-400" : active ? "bg-white" : "bg-white/20",
                                ].join(" ")}
                            />
                            <div className="text-xs text-white/70">{s.t}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function PublishPage() {
    const { draft } = useDraftAutosave();

    useDynamicTitle(draft.profile.fullName);

    const defaultRepoName = useMemo(() => {
        const base = (draft?.profile?.fullName || "my-portfolio")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-_]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
        return (base || "my-portfolio").slice(0, 60);
    }, [draft?.profile?.fullName]);

    const [repoName, setRepoName] = useState(defaultRepoName);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    const [step, setStep] = useState(0);
    const stepTimer = useRef<number | null>(null);

    useEffect(() => {
        setRepoName((prev) => (prev === "my-portfolio" || prev === "" ? defaultRepoName : prev));
    }, [defaultRepoName]);

    function stopStepper() {
        if (stepTimer.current) {
            window.clearInterval(stepTimer.current);
            stepTimer.current = null;
        }
    }

    function startStepper() {
        stopStepper();
        setStep(0);
        stepTimer.current = window.setInterval(() => {
            setStep((s) => (s < LOADER_STEPS.length - 1 ? s + 1 : s));
        }, 1200);
    }

    const completion = useMemo(() => {
        let score = 0;
        const p = draft.profile;
        if (p.fullName) score += 10;
        if (p.headline) score += 10;
        if (p.summary) score += 15;
        if (draft.experience.length) score += 20;
        if (draft.projects.length) score += 20;
        if (draft.skills.length) score += 15;
        if (draft.education.length) score += 10;
        return Math.min(100, score);
    }, [draft]);

    const canPublish = useMemo(() => {
        // soft-gate: allow publish but warn if too low
        return Boolean(repoName.trim().length >= 2);
    }, [repoName]);

    async function publish() {
        setLoading(true);
        setError("");
        setResult(null);

        startStepper();

        try {
            setStep(1);

            const res = await fetch("/api/publish/github", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repoName, draft }),
                credentials: "include",
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error || "Publish failed");

            // mark done
            setStep(LOADER_STEPS.length - 1);
            setResult(data);
        } catch (e: any) {
            setError(e?.message || "Failed");
        } finally {
            stopStepper();
            setLoading(false);
        }
    }

    const active = LOADER_STEPS[Math.min(step, LOADER_STEPS.length - 1)];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Publish</h1>
                    <p className="mt-1 text-sm text-white/60">
                        Create a public GitHub repo of your portfolio (editable) and deploy with one click.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Pill>Template: {draft.templateId}</Pill>
                    <Pill>Completion: {completion}%</Pill>
                    <Pill>Dark-only</Pill>
                </div>
            </div>

            {/* Main */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-4">
                {/* Left: controls */}
                <div className="space-y-4">
                    <SectionCard
                        title="GitHub Repo"
                        subtitle="We’ll generate a new repo in your GitHub account and inject your data."
                        right={
                            <button
                                onClick={publish}
                                disabled={loading || !canPublish}
                                className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition
                           disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Publishing…" : "Create GitHub Repo"}
                            </button>
                        }
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Repository name"
                                value={repoName}
                                onChange={setRepoName}
                                placeholder="my-portfolio"
                                hint="Tip: keep it short. Example: yash-portfolio"
                            />

                            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                <div className="text-xs text-white/60">What happens on Publish</div>
                                <div className="mt-3 space-y-2 text-sm text-white/75">
                                    <div className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                                        Repo is created from your template
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                                        Your data saved in <span className="font-mono text-white/90">data/draft.json</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                                        You get a Vercel Deploy link (no coding)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* warnings */}
                        {completion < 35 ? (
                            <div className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-200">
                                Your portfolio completion is low ({completion}%). You can still publish, but it may look empty.
                                Consider adding at least 1 experience/project and a short summary.
                            </div>
                        ) : null}

                        {error ? (
                            <div className="mt-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm text-rose-200">
                                {error}
                            </div>
                        ) : null}
                    </SectionCard>

                    {/* Result */}
                    {result?.ok ? (
                        <SectionCard title="Success 🎉" subtitle="Your repository is ready. Next: deploy on Vercel.">
                            <div className="space-y-3 text-sm">
                                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                    <div className="text-xs text-white/60 mb-2">GitHub Repository</div>
                                    <a
                                        className="underline text-white/90 hover:text-white"
                                        href={result.repo.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {result.repo.url}
                                    </a>
                                </div>

                                <div className="flex flex-col md:flex-row gap-2">
                                    <a
                                        href={result.repo.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition text-center"
                                    >
                                        Open Repo
                                    </a>

                                    <a
                                        href={result.deploy.vercel}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition text-center"
                                    >
                                        Deploy to Vercel
                                    </a>
                                </div>

                                <div className="text-xs text-white/55">
                                    Want to edit later? Update <span className="font-mono">data/draft.json</span> in your repo and redeploy.
                                </div>
                            </div>
                        </SectionCard>
                    ) : null}
                </div>

                {/* Right: interactive loader / preview */}
                <div className="space-y-4">
                    <SectionCard
                        title="Publishing Status"
                        subtitle="We’ll show progress here while we work."
                    >
                        {loading ? (
                            <PublishProgress activeIndex={step} title={active.t} desc={active.d} />
                        ) : result?.ok ? (
                            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                <div className="text-sm font-medium">Ready ✅</div>
                                <div className="mt-1 text-xs text-white/60">
                                    Repo created and data injected successfully.
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                <div className="text-sm font-medium">Waiting…</div>
                                <div className="mt-1 text-xs text-white/60">
                                    Click <span className="text-white/80">Create GitHub Repo</span> to publish your portfolio.
                                </div>
                            </div>
                        )}

                        {/* A small “what you’ll get” teaser */}
                        <div className="mt-4 grid grid-cols-1 gap-3">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="text-xs text-white/60">You’ll get</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <Pill>Public GitHub repo</Pill>
                                    <Pill>Editable code</Pill>
                                    <Pill>Deploy link</Pill>
                                    <Pill>Single-page portfolio</Pill>
                                </div>
                            </div>
                        </div>
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}
