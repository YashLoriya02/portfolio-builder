"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { toast } from "sonner";

const STORAGE_KEY = "portfolio_builder:published_projects:v1";

type UiError = {
    title: string;
    message: string;
    code?: string | number;
    hint?: string;
    actions?: { label: string; onClick?: () => void; href?: string }[];
    debug?: any;
};

type DeployPhase = "idle" | "deploying" | "ready" | "error";

type DeployResult = {
    deploymentId: string;
    url: string | null;
    status?: string;
};

type DeployStatus = {
    id: string;
    url: string | null;
    state: "QUEUED" | "BUILDING" | "READY" | "ERROR" | string;
    error?: any;
};

type DeployUiState = {
    phase: DeployPhase;
    deploymentId?: string;
    url?: string | null;
    state?: string;
    message?: string;
    raw?: any;
};

type PublishedProject = {
    repoName: string;
    repoUrl: string;
    projectUrl: string;
    templateId: string;
    vercelProjectName: string;
    publishedAt: string; // ISO
};

function savePublishedProject(project: PublishedProject) {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: PublishedProject[] = raw ? JSON.parse(raw) : [];

    const exists = list.find((p) => p.repoUrl === project.repoUrl);
    if (exists) return;

    list.unshift(project);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function miniHumanizeDeployError(payload: any) {
    const text =
        typeof payload === "string"
            ? payload
            : JSON.stringify(payload?.details || payload?.error || payload || "");

    const low = text.toLowerCase();

    if (low.includes("install") && low.includes("github")) {
        return {
            title: "Vercel needs GitHub access",
            message:
                "Please install the Vercel GitHub App for your GitHub account/org and try again.",
            hint: "After installing, come back and click Deploy again.",
        };
    }

    if (low.includes("already exists")) {
        return {
            title: "Vercel project already exists",
            message:
                "A Vercel project with this name already exists. Try deploying again or rename the repo/slug.",
        };
    }

    return {
        title: "Deployment failed",
        message: "We couldn't deploy to Vercel. Please try again.",
    };
}

function StatusBadge({ state }: { state?: string }) {
    if (!state) return null;

    const style =
        state === "READY"
            ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
            : state === "ERROR"
                ? "border-rose-500/25 bg-rose-500/10 text-rose-200"
                : "border-white/10 bg-white/5 text-white/70";

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${style}`}>
            {state}
        </span>
    );
}

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
    const [error, setError] = useState<UiError | null>(null);
    const [step, setStep] = useState(0);
    const stepTimer = useRef<number | null>(null);

    const [deployState, setDeployState] = useState<DeployUiState>({ phase: "idle" });
    const deployPoller = useRef<number | null>(null);
    let projectName = "";

    function stopDeployPolling() {
        if (deployPoller.current) {
            window.clearInterval(deployPoller.current);
            deployPoller.current = null;
        }
    }

    useEffect(() => {
        return () => {
            stopStepper();
            stopDeployPolling();
        };
    }, []);

    useEffect(() => {
        if (deployState.phase === "ready" && deployState.url && result?.repo?.url) {
            savePublishedProject({
                repoName,
                repoUrl: result.repo.url,
                projectUrl: deployState.url,
                publishedAt: new Date().toISOString(),
                templateId: draft.templateId,
                vercelProjectName: repoName,
            });
        }
    }, [deployState.phase]);

    useEffect(() => {
        setRepoName((prev) => (prev === "my-portfolio" || prev === "" ? defaultRepoName : prev));
    }, [defaultRepoName]);

    async function pollDeployStatus(deploymentId: string) {
        stopDeployPolling();

        const startedAt = Date.now();

        deployPoller.current = window.setInterval(async () => {
            try {
                const res = await fetch(`/api/publish/deploy-status?id=${deploymentId}&projectName=${projectName}`, {
                    method: "GET",
                    cache: "no-store",
                });

                const json: DeployStatus = await res.json().catch(() => ({} as any));

                if (!res.ok) {
                    stopDeployPolling();
                    setDeployState({
                        phase: "error",
                        message: miniHumanizeDeployError(json).message,
                        raw: json,
                    });
                    return;
                }

                setDeployState((s) => ({
                    ...s,
                    state: json.state,
                    url: json.url ?? s.url ?? null,
                }));

                if (json.state === "READY") {
                    stopDeployPolling();
                    setDeployState((s) => ({ ...s, phase: "ready" }));

                    toast.success("Portfolio is live 🎉");
                }

                if (json.state === "ERROR") {
                    stopDeployPolling();
                    setDeployState({
                        phase: "error",
                        message: "Deployment failed on Vercel. Please retry.",
                        raw: json,
                    });
                }

                if (Date.now() - startedAt > 180000) {
                    stopDeployPolling();
                    setDeployState({
                        phase: "error",
                        message: "Deployment is taking too long. Please try again.",
                    });
                }
            } catch (e: any) {
                stopDeployPolling();
                setDeployState({
                    phase: "error",
                    message: "Network error while checking deployment status.",
                    raw: String(e?.message || e),
                });
            }
        }, 2500);
    }

    async function deployToVercel() {
        if (!result?.ok) {
            setDeployState({
                phase: "error",
                message: "Please create the GitHub repo first, then deploy.",
            });
            return;
        }

        setDeployState({ phase: "deploying", message: "Starting deployment...", state: "QUEUED" });

        try {
            const repoUrl = result?.repo?.url as string;
            const match = repoUrl?.match(/github\.com\/([^/]+)\/([^/]+)(?:\/|$)/i);

            if (!match) {
                setDeployState({
                    phase: "error",
                    message: "Could not read GitHub owner/repo from the repo URL.",
                    raw: { repoUrl },
                });
                return;
            }

            const repoOwner = match[1];
            const repoNameFromUrl = match[2];

            projectName = repoNameFromUrl.toLowerCase();

            const res = await fetch("/api/publish/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectName,
                    repoOwner,
                    repoName: repoNameFromUrl,
                    production: true,
                }),
            });

            const json: (DeployResult & { error?: any; details?: any }) = await res.json().catch(() => ({} as any));

            if (!res.ok) {
                const nice = miniHumanizeDeployError(json);
                setDeployState({
                    phase: "error",
                    message: nice.message,
                    raw: json,
                });
                return;
            }

            setDeployState({
                phase: "deploying",
                deploymentId: json.deploymentId,
                url: json.url ?? null,
                state: json.status ?? "QUEUED",
                message: "Deploying…",
            });

            await pollDeployStatus(json.deploymentId);
        } catch (e: any) {
            setDeployState({
                phase: "error",
                message: "Something went wrong while deploying.",
                raw: String(e?.message || e),
            });
        }
    }

    async function copyToClipboard(text?: string | null) {
        if (!text) return;
        await navigator.clipboard.writeText(text);
        setDeployState((s) => ({ ...s, message: "Copied link!" }));
        window.setTimeout(() => setDeployState((s) => ({ ...s, message: undefined })), 1200);

        toast.success("Link Copied Successfully!");
    }

    function resetDeployUi() {
        stopDeployPolling();
        setDeployState({ phase: "idle" });
    }


    function stopStepper() {
        if (stepTimer.current) {
            window.clearInterval(stepTimer.current);
            stepTimer.current = null;
        }
    }

    function normalizePublishError(apiError: any) {
        console.log("API Error: ", apiError)

        if (apiError?.includes("Name already exists") || apiError?.includes("GitHub API 422")) {
            return {
                title: "Repository name already exists",
                message: `You already have a GitHub repository named "${repoName}".`,
                code: 422,
                actions: [],
            };
        }

        else {
            return {
                title: "Publish failed",
                message:
                    "We couldn't create your GitHub repository. Please try again or choose a different name.",
            };
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
        setError(null);
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

            setStep(LOADER_STEPS.length - 1);
            setResult(data);
        } catch (e: any) {
            const uiErr = normalizePublishError(e.toString());
            setError(uiErr);
        } finally {
            stopStepper();
            setLoading(false);
        }
    }

    const active = LOADER_STEPS[Math.min(step, LOADER_STEPS.length - 1)];

    return (
        <div className="space-y-6">
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
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-4">
                {/* Left: controls */}
                <div className="space-y-4">
                    <SectionCard
                        title="GitHub Repo"
                        subtitle="We'll generate a new repo in your GitHub account and inject your data."
                        right={
                            <button
                                onClick={publish}
                                disabled={loading || !canPublish}
                                className="rounded-xl bg-white text-black px-4 py-2 text-sm hover:opacity-90 transition
                           disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Publishing…" : "Create Repo"}
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
                            <div className="mt-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-rose-200">{error.title}</div>
                                        <div className="mt-1 text-sm text-rose-200/80">{error.message}</div>
                                        {error.hint ? (
                                            <div className="mt-2 text-xs text-rose-200/70">{error.hint}</div>
                                        ) : null}
                                    </div>

                                    <div className="text-xs text-rose-200/60">
                                        {error.code ? `Error ${error.code}` : null}
                                    </div>
                                </div>

                                {error.actions?.length ? (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {error.actions.map((a, i) =>
                                            a.href ? (
                                                <a
                                                    key={i}
                                                    href={a.href}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 transition"
                                                >
                                                    {a.label}
                                                </a>
                                            ) : (
                                                <button
                                                    key={i}
                                                    onClick={a.onClick}
                                                    className="rounded-xl bg-white text-black px-3 py-2 text-xs font-medium hover:opacity-90 transition"
                                                >
                                                    {a.label}
                                                </button>
                                            )
                                        )}
                                        <button
                                            onClick={publish}
                                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 transition"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </SectionCard>

                    {result?.ok ? (
                        <SectionCard
                            title="Success 🎉 Next steps (2 minutes)"
                            subtitle="Your repository is ready. Follow this checklist to get your live portfolio link."
                        >
                            <div className="rounded-2xl w-full mb-4 border border-white/10 bg-black/30 p-4">
                                <div className="text-xs text-white/60 mb-2">GitHub Repository</div>
                                <div className="w-full flex justify-between items-center">
                                    <a
                                        className="underline text-white/90 hover:text-white"
                                        href={result.repo.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {result.repo.url}
                                    </a>

                                    <a
                                        href={result.repo.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-sm hover:bg-white/10 transition text-center"
                                    >
                                        Open Repo
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                    <div className="text-xs text-white/60 mb-3">Checklist</div>

                                    <div className="space-y-3 text-sm text-white/80">
                                        <div className="flex gap-3">
                                            <span className="mt-0.5 h-5 w-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs">1</span>
                                            <div>
                                                <div className="font-medium">Open your GitHub repo</div>
                                                <div className="text-xs text-white/55 mt-1">
                                                    Confirm your content exists in <span className="font-mono">data/draft.json</span>.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <span className="mt-0.5 h-5 w-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs">2</span>
                                            <div>
                                                <div className="font-medium">Deploy to Vercel</div>
                                                <div className="text-xs text-white/55 mt-1">
                                                    Click <span className="text-white/80">Deploy to Vercel</span>. Vercel will auto-import the repo and give you a live URL.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <span className="mt-0.5 h-5 w-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs">3</span>
                                            <div>
                                                <div className="font-medium">Share your live link</div>
                                                <div className="text-xs text-white/55 mt-1">
                                                    Your portfolio becomes public at the Vercel URL. You can add a custom domain anytime.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <span className="mt-0.5 h-5 w-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs">4</span>
                                            <div>
                                                <div className="font-medium">Edit later (no need to rebuild)</div>
                                                <div className="text-xs text-white/55 mt-1">
                                                    Update <span className="font-mono">data/draft.json</span> in GitHub → redeploy on Vercel (often automatic).
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                    <div className="text-xs text-white/60 mb-3">What we created</div>

                                    <div className="space-y-3 text-sm text-white/80">
                                        <div className="flex items-start gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white/60 mt-2" />
                                            <div>
                                                <div className="font-medium">Public GitHub repository</div>
                                                <div className="text-xs text-white/55 mt-1">
                                                    Your portfolio code + template is stored here.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white/60 mt-2" />
                                            <div>
                                                <div className="font-medium">
                                                    Content file: <span className="font-mono text-white/90">data/draft.json</span>
                                                </div>
                                                <div className="text-xs text-white/55 mt-1">
                                                    This is where your resume + edits are saved. Edit this to update your portfolio quickly.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white/60 mt-2" />
                                            <div>
                                                <div className="font-medium">Deploy-ready setup</div>
                                                <div className="text-xs text-white/55 mt-1">
                                                    Vercel can import this repo and deploy with minimal configuration.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ */}
                            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="text-xs text-white/60 mb-2">Troubleshooting</div>
                                <div className="space-y-2 text-xs text-white/70">
                                    <div>• Repo name already exists? Choose a different repository name and publish again.</div>
                                    <div>• Deploy fails on Vercel? Make sure GitHub access is granted and try re-importing the repo in Vercel.</div>
                                    <div>• Looks empty? Add 1–2 Projects/Experience in Editor and republish or update <span className="font-mono">data/draft.json</span>.</div>
                                </div>
                            </div>
                        </SectionCard>
                    ) : null}
                </div>

                <div className="space-y-4">
                    <SectionCard
                        title="Publishing Status"
                        subtitle="Progress will be shown here while we work."
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

                    {result?.ok ? (
                        <SectionCard
                            title="Deploy to Vercel"
                            subtitle="We'll deploy your GitHub repo and give you a live URL here."
                            right={
                                <button
                                    onClick={deployToVercel}
                                    disabled={deployState.phase === "deploying"}
                                    className="rounded-xl bg-white text-black px-4 py-2 text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deployState.phase === "deploying" ? "Deploying…" : "Deploy now"}
                                </button>
                            }
                        >
                            <div className="flex flex-col gap-4">
                                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="text-xs text-white/60">Deployment status</div>
                                        <StatusBadge state={deployState.state} />
                                    </div>

                                    {deployState.phase === "idle" ? (
                                        <div className="mt-3 text-sm text-white/75">
                                            Click <span className="text-white/90">Deploy now</span> to publish your portfolio.
                                        </div>
                                    ) : null}

                                    {deployState.phase === "deploying" ? (
                                        <div className="mt-3">
                                            <div className="flex items-start gap-3">
                                                <Spinner />
                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium">
                                                        Deploying to Vercel…
                                                    </div>
                                                    <div className="mt-1 text-xs text-white/60">
                                                        {deployState.message || "This usually takes under a minute."}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 text-xs text-white/60">
                                                {deployState.deploymentId ? (
                                                    <div>
                                                        Deployment ID:{" "}
                                                        <span className="font-mono text-white/80">
                                                            {deployState.deploymentId}
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : null}

                                    {deployState.phase === "ready" ? (
                                        <div className="mt-3">
                                            <div className="text-sm font-medium">Live ✅</div>
                                            <div className="mt-1 text-xs text-white/60">
                                                Your portfolio is now live.
                                            </div>

                                            {deployState.url ? (
                                                <a
                                                    href={deployState.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-3 block underline text-white/90 hover:text-white"
                                                >
                                                    {deployState.url}
                                                </a>
                                            ) : null}

                                            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                                <a
                                                    href={deployState.url || "#"}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full rounded-xl bg-white/90 text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition text-center"
                                                >
                                                    Open live site
                                                </a>
                                                <button
                                                    onClick={() => copyToClipboard(deployState.url)}
                                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                                                >
                                                    Copy link
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}

                                    {deployState.phase === "error" ? (
                                        <div className="mt-3 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4">
                                            <div className="text-sm font-semibold text-rose-200">
                                                Deployment failed
                                            </div>
                                            <div className="mt-1 text-sm text-rose-200/80">
                                                {deployState.message || "Please try again."}
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <button
                                                    onClick={deployToVercel}
                                                    className="rounded-xl bg-white text-black px-3 py-2 text-xs font-medium hover:opacity-90 transition"
                                                >
                                                    Retry deploy
                                                </button>
                                                <button
                                                    onClick={resetDeployUi}
                                                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 transition"
                                                >
                                                    Dismiss
                                                </button>

                                                {/* optional: keep the manual deploy link */}
                                                {result?.deploy?.vercel ? (
                                                    <a
                                                        href={result.deploy.vercel}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 transition"
                                                    >
                                                        Open Vercel import
                                                    </a>
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                {/* Right: Helpful info */}
                                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                    <div className="text-xs text-white/60">What happens</div>

                                    <div className="mt-3 space-y-2 text-sm text-white/75">
                                        <div className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                                            We link your GitHub repo to a Vercel project
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                                            We trigger a production deployment
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                                            You get a shareable live URL here
                                        </div>
                                    </div>

                                    {result?.repo?.url ? (
                                        <div className="mt-4 text-xs text-white/60">
                                            Repo:
                                            <a
                                                href={result.repo.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="ml-2 underline text-white/80 hover:text-white"
                                            >
                                                {result.repo.url}
                                            </a>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </SectionCard>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
