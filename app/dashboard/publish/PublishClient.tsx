"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { toast } from "sonner";
import Link from "next/link";
import { SiVercel, SiNetlify } from 'react-icons/si';
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BiLoader } from "react-icons/bi";

type UiError = {
    title: string;
    message: string;
    code?: string | number;
    hint?: string;
    actions?: { label: string; onClick?: () => void; href?: string }[];
    debug?: any;
};

function SectionCard({
    isRepo,
    isDeploy,
    title,
    subtitle,
    right,
    children,
}: {
    isRepo?: Boolean;
    isDeploy?: Boolean;
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
            <div
                className={`flex ${isDeploy ? "flex-col" : ""} items-start justify-between gap-4 ${isRepo ? "flex-col md:flex-row" : ""}`}
            >
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
    const [fetchLoading, setFetchLoading] = useState(false);
    const [deployProvider, setDeployProvider] = useState<"vercel" | "netlify">("vercel");
    const [importOpened, setImportOpened] = useState(false);
    const [liveUrl, setLiveUrl] = useState("");
    const [savingLiveUrl, setSavingLiveUrl] = useState(false);

    const stepTimer = useRef<number | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();

    async function fetchProjectByGithubUrl(githubUrl: string): Promise<void> {
        setFetchLoading(true)
        const userId = localStorage.getItem("pb_user_id");

        try {
            const res = await fetch(`/api/publish/project/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ githubUrl })
            });

            const pData = await res.json();
            setResult(pData)

            setTimeout(() => {
                setFetchLoading(false)
            }, 2000);
        } catch (e) {
            console.log(e)
            setFetchLoading(false)
        }
    }

    useEffect(() => {
        const value = searchParams.get("githubUrl");

        if (value) {
            fetchProjectByGithubUrl(value)
            router.replace(pathname, { scroll: false });
        }
    }, [searchParams, router, pathname])

    useEffect(() => {
        setRepoName((prev) => (prev === "my-portfolio" || prev === "" ? defaultRepoName : prev));
    }, [defaultRepoName]);

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

    const canPublish = useMemo(() => Boolean(repoName.trim().length >= 2), [repoName]);

    const scrollToBottom = () => {
        const container = document.getElementById("dashboard-scroll");
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (container) {
                    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
                } else {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                }
            });
        });
    };

    const getVercelImportUrl = () => {
        const repoUrl = result?.repo?.url as string | undefined;
        if (!repoUrl) return null;
        return `https://vercel.com/new/import?s=${encodeURIComponent(repoUrl)}`;
    };

    const getNetlifyImportUrl = () => {
        const repoUrl = result?.repo?.url as string | undefined;
        if (!repoUrl) return null;
        return `https://app.netlify.com/start/deploy?repository=${encodeURIComponent(repoUrl)}`;
    };

    const openImport = (provider: "vercel" | "netlify") => {
        if (!result?.repo?.url) {
            toast.error("Please create the GitHub repo first.");
            return;
        }

        const url = provider === "vercel" ? getVercelImportUrl() : getNetlifyImportUrl();
        if (!url) {
            toast.error("Missing repo URL. Please publish again.");
            return;
        }

        setDeployProvider(provider);
        window.open(url, "_blank", "noopener,noreferrer");
        setImportOpened(true);

        toast.message(provider === "vercel" ? "Opening Vercel…" : "Opening Netlify…", {
            description: "Deploy your repo there, then paste your live link here.",
        });

        const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
        if (isMobile()) scrollToBottom();
    };

    const normalizeLiveUrl = (raw: string) => {
        let v = raw.trim();
        if (!v) return "";
        if (!v.startsWith("http://") && !v.startsWith("https://")) v = `https://${v}`;
        try {
            const u = new URL(v);
            return u.origin;
        } catch {
            return "";
        }
    };

    const saveLiveUrl = async () => {
        const clean = normalizeLiveUrl(liveUrl);

        if (!clean) {
            toast.error("Please paste a valid live URL (example: https://my-site.vercel.app)");
            return;
        }
        if (!result?.repo?.url) {
            toast.error("Missing repo info. Please publish again.");
            return;
        }

        console.log("repoName: ", repoName)

        setSavingLiveUrl(true);
        try {
            await fetch("/api/publish/deploy", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    repoName,
                    cloudProvider: clean.includes("netlify") ? "netlify" : "vercel",
                    deployUrl: clean,
                }),
            });

            toast.success("Saved! Your portfolio is live 🎉");
        } catch {
            toast.error("Could not save the live URL. Please try again.");
        } finally {
            setSavingLiveUrl(false);
        }
    };

    async function copyToClipboard(text?: string | null) {
        if (!text) return;
        await navigator.clipboard.writeText(text);
        toast.success("Link copied!");
    }

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

    function normalizePublishError(apiError: any) {
        if (apiError?.includes("Name already exists") || apiError?.includes("GitHub API 422")) {
            return {
                title: "Repository name already exists",
                message: `You already have a GitHub repository named "${repoName}".`,
                code: 422,
                actions: [],
            };
        }

        return {
            title: "Publish failed",
            message: "We couldn't create your GitHub repository. Please try again or choose a different name.",
        };
    }

    async function publish() {
        setLoading(true);
        setError(null);
        setResult(null);

        // reset deploy area each publish
        setImportOpened(false);
        setLiveUrl("");
        setDeployProvider("vercel");

        const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
        if (isMobile()) scrollToBottom();

        startStepper();

        try {
            setStep(1);

            const res = await fetch("/api/publish/github", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repoName, draft, userId: session?.mongoUserId }),
                credentials: "include",
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error || "Publish failed");

            setStep(LOADER_STEPS.length - 1);
            setResult(data);

            await fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "github",
                    repoName,
                    repoUrl: data.repo.url,
                }),
            });

            toast.success("Repo created ✅");
        } catch (e: any) {
            const uiErr = normalizePublishError(String(e?.message || e));
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

            {
                fetchLoading
                    ? <div className="mt-10 flex flex-col gap-3 justify-center items-center bg-red-500 w-full">
                        <BiLoader size={50} className="mx-auto animate-spin" />
                        <h1 className="text-2xl tracking-wide">Fetching Github Repository Data...</h1>
                    </div>
                    : <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-4">
                        {/* Left */}
                        <div className="space-y-4">
                            <SectionCard
                                isRepo={true}
                                title="GitHub Repo"
                                subtitle="We'll generate a new repo in your GitHub account and inject your data."
                                right={
                                    <button
                                        onClick={publish}
                                        disabled={loading || !canPublish}
                                        className="rounded-xl bg-white text-black w-full md:w-auto px-10 md:px-4 py-2 text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                You deploy in your own Vercel/Netlify account
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {completion < 35 ? (
                                    <div className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-200">
                                        Your portfolio completion is low ({completion}%). You can still publish, but it may look empty.
                                        Consider adding at least 1 experience/project and a short summary.
                                    </div>
                                ) : null}

                                {error ? (
                                    <div className="mt-4 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4">
                                        <div className="text-sm font-semibold text-rose-200">{error.title}</div>
                                        <div className="mt-1 text-sm text-rose-200/80">{error.message}</div>
                                        {error.hint ? <div className="mt-2 text-xs text-rose-200/70">{error.hint}</div> : null}
                                    </div>
                                ) : null}
                            </SectionCard>

                            {/* ✅ THIS IS THE “BOTTOM LEFT PART” YOU ASKED FOR */}
                            {result?.ok ? (
                                <SectionCard
                                    title="Success 🎉 Next steps (2 minutes)"
                                    subtitle="Your repository is ready. Deploy it on Vercel or Netlify and paste the live URL."
                                >
                                    <div className="rounded-2xl w-full mb-4 border border-white/10 bg-black/30 p-4">
                                        <div className="text-xs text-white/60 mb-2">GitHub Repository</div>
                                        <div className="w-full gap-3 md:gap-0 flex-col md:flex-row flex justify-between md:items-center">
                                            <a
                                                className="underline text-white/90 hover:text-white break-all"
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
                                                    <span className="mt-0.5 h-5 w-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs">
                                                        1
                                                    </span>
                                                    <div>
                                                        <div className="font-medium">Open your GitHub repo</div>
                                                        <div className="text-xs text-white/55 mt-1">
                                                            Confirm your content exists in <span className="font-mono">data/draft.json</span>.
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <span className="mt-0.5 h-5 w-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs">
                                                        2
                                                    </span>
                                                    <div>
                                                        <div className="font-medium">Deploy on Vercel or Netlify</div>
                                                        <div className="text-xs text-white/55 mt-1">
                                                            Use the import buttons. It deploys inside your own account, so any login works.
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <span className="mt-0.5 h-5 w-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs">
                                                        3
                                                    </span>
                                                    <div>
                                                        <div className="font-medium">Paste the live URL</div>
                                                        <div className="text-xs text-white/55 mt-1">
                                                            Paste your <span className="font-mono">.vercel.app</span> or{" "}
                                                            <span className="font-mono">.netlify.app</span> link on the right and save it.
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <span className="mt-0.5 h-5 w-5 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs">
                                                        4
                                                    </span>
                                                    <div>
                                                        <div className="font-medium">Edit later</div>
                                                        <div className="text-xs text-white/55 mt-1">
                                                            Update <span className="font-mono">data/draft.json</span> in GitHub and redeploy.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                            <div className="text-xs text-white/60 mb-3">Troubleshooting</div>
                                            <div className="space-y-2 text-xs text-white/70">
                                                <div>• Repo name already exists? Choose a different repository name.</div>
                                                <div>• Vercel issue? Try Netlify import instead.</div>
                                                <div>
                                                    • Looks empty? Add Projects/Experience in Editor and republish or update{" "}
                                                    <span className="font-mono">data/draft.json</span>.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SectionCard>
                            ) : null}
                        </div>

                        {/* Right */}
                        <div className="space-y-4">
                            <SectionCard title="Publishing Status" subtitle="Progress will be shown here while we work.">
                                {loading ? (
                                    <PublishProgress activeIndex={step} title={active.t} desc={active.d} />
                                ) : result?.ok ? (
                                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                        <div className="text-sm font-medium">Ready ✅</div>
                                        <div className="mt-1 text-xs text-white/60">Repo created and data injected successfully.</div>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                        <div className="text-sm font-medium">Waiting…</div>
                                        <div className="mt-1 text-xs text-white/60">
                                            Click <span className="text-white/80">Create Repo</span> to publish your portfolio.
                                        </div>
                                    </div>
                                )}

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

                            {/* ✅ Deploy Section (Vercel + Netlify x2 + paste live URL) */}
                            {result?.ok ? (
                                <SectionCard
                                    isDeploy={true}
                                    title="Deploy your repo"
                                    subtitle="Deploy inside your Vercel/Netlify account. After deploy, paste your live URL below."
                                    right={
                                        <div className="flex flex-col gap-2 w-full">
                                            {/* Row 1 */}
                                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                                                {/* Vercel */}
                                                <button
                                                    onClick={() => openImport("vercel")}
                                                    className="rounded-xl bg-white text-black w-full px-6 py-2 flex items-center justify-center gap-3 text-sm hover:opacity-90 transition"
                                                >
                                                    <SiVercel className="w-4 h-4" />
                                                    Deploy in Vercel
                                                </button>

                                                {/* Netlify (Recommended) */}
                                                <button
                                                    onClick={() => {
                                                        setDeployProvider("netlify");
                                                        window.open("https://app.netlify.com/", "_blank", "noopener,noreferrer");
                                                        setImportOpened(true);

                                                        toast.message("Opening Netlify…", {
                                                            description:
                                                                "Netlify → Add new site → Import an existing project → GitHub → select your repo. Then paste your live link here.",
                                                        });

                                                        const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
                                                        if (isMobile()) scrollToBottom();
                                                    }}
                                                    className="rounded-xl bg-white text-black w-full px-6 py-2 flex items-center justify-center gap-3 text-sm hover:opacity-90 transition"
                                                >
                                                    <SiNetlify className="w-5 h-5" />
                                                    Netlify (Recommended)
                                                </button>
                                            </div>

                                            {/* Row 2: Netlify auto deploy that can create/copy repo */}
                                            <button
                                                onClick={() => {
                                                    const repoUrl = result?.repo?.url as string | undefined;
                                                    if (!repoUrl) {
                                                        toast.error("Please create the GitHub repo first.");
                                                        return;
                                                    }

                                                    const url = `https://app.netlify.com/start/deploy?repository=${encodeURIComponent(
                                                        repoUrl
                                                    )}`;

                                                    setDeployProvider("netlify");
                                                    window.open(url, "_blank", "noopener,noreferrer");
                                                    setImportOpened(true);

                                                    toast.message("Opening Netlify Auto Deploy…", {
                                                        description:
                                                            "This flow may create a new repo/copy in GitHub depending on Netlify permissions. Use Recommended if you want no extra repo.",
                                                    });

                                                    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
                                                    if (isMobile()) scrollToBottom();
                                                }}
                                                className="rounded-xl border border-white/10 bg-white/5 text-white w-full px-6 py-2 flex items-center justify-center gap-3 text-sm hover:bg-white/10 transition"
                                            >
                                                <SiNetlify className="w-5 h-5" />
                                                Netlify (Auto Deploy • may create repo copy in your github)
                                            </button>
                                        </div>
                                    }
                                >
                                    <div className="flex flex-col gap-4">
                                        {/* Step 1 */}
                                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                            <div className="text-xs text-white/60">Step 1</div>
                                            <div className="mt-1 text-sm text-white/80">
                                                Deploy your repo on{" "}
                                                <span className="font-semibold text-white">Vercel</span> or{" "}
                                                <span className="font-semibold text-white">Netlify</span>.
                                            </div>

                                            {result?.repo?.url ? (
                                                <div className="mt-3 text-xs text-white/60">
                                                    Repo:
                                                    <a
                                                        href={result.repo.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="ml-2 underline text-white/80 hover:text-white break-all"
                                                    >
                                                        {result.repo.url}
                                                    </a>
                                                </div>
                                            ) : null}

                                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {/* Vercel instructions */}
                                                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                                    <div className="text-xs text-white/60">Vercel</div>
                                                    <div className="mt-1 text-xs text-white/75 leading-relaxed">
                                                        Click <span className="text-white/90 font-medium">Deploy in Vercel</span> → login →
                                                        import repo → Deploy.
                                                    </div>
                                                </div>

                                                {/* Netlify instructions */}
                                                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                                    <div className="text-xs text-white/60">Netlify</div>
                                                    <div className="mt-1 text-xs text-white/75 leading-relaxed space-y-1">
                                                        <div>
                                                            <span className="text-white/90 font-medium">Recommended:</span> Add new site → Import an existing project
                                                            → GitHub → select repo.
                                                        </div>
                                                        <div>
                                                            <span className="text-white/90 font-medium">Auto Deploy:</span> Quick flow, but may create/copy repo.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step 2 (Optional) Domain */}
                                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                            <div className="text-xs text-white/60">Step 2 (Optional)</div>
                                            <div className="mt-1 text-sm text-white/80 font-medium">
                                                Connect a custom domain (free)
                                            </div>
                                            <div className="mt-2 text-sm text-white/70">
                                                Once your site is live, you can change your domain from the provider dashboard.
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {/* Vercel */}
                                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                                    <div className="text-sm font-semibold">Vercel</div>
                                                    <div className="mt-2 text-xs text-white/70 leading-relaxed space-y-1">
                                                        <div>
                                                            <span className="font-medium text-white/85">Domains</span> →{" "}
                                                            <span className="font-medium text-white/85">Add Domain</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Netlify */}
                                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                                    <div className="text-sm font-semibold">Netlify</div>
                                                    <div className="mt-2 text-xs text-white/70 leading-relaxed space-y-1">
                                                        <div>
                                                            <span className="font-medium text-white/85">Domain Management</span> →{" "}
                                                            <span className="font-medium text-white/85">Add Domain</span>
                                                        </div>
                                                        <div>
                                                            Choose:{" "}
                                                            <span className="font-medium text-white/85">
                                                                Add a domain you already own
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step 3: Paste URL */}
                                        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                                            <div className="text-xs text-white/60">Step 3</div>
                                            <div className="mt-1 text-sm text-white/80">
                                                Paste your live URL here (Vercel or Netlify). Example:{" "}
                                                <span className="font-mono">https://my-site.vercel.app</span> or{" "}
                                                <span className="font-mono">https://my-site.netlify.app</span>
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 gap-3">
                                                <Input
                                                    label="Your live URL"
                                                    value={liveUrl}
                                                    onChange={setLiveUrl}
                                                    placeholder="https://your-portfolio.vercel.app"
                                                    hint={importOpened ? "Tip: copy the public site URL from the provider dashboard." : undefined}
                                                />

                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <button
                                                        onClick={saveLiveUrl}
                                                        disabled={savingLiveUrl}
                                                        className="w-full rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                                                    >
                                                        {savingLiveUrl ? "Saving…" : "Save live link"}
                                                    </button>

                                                    <button
                                                        onClick={() => copyToClipboard(liveUrl)}
                                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                                                    >
                                                        Copy
                                                    </button>

                                                    <Link
                                                        href={"/dashboard/published"}
                                                        className="w-full flex justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                                                    >
                                                        Published Portfolios
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                            <div className="text-xs text-white/60">Why this works for every user</div>
                                            <div className="mt-2 text-sm text-white/75">
                                                We don’t deploy using your tokens. The user deploys inside their own Vercel/Netlify account.
                                                <ul className="ml-5 mt-2 list-disc space-y-1 text-white/70">
                                                    <li>More secure</li>
                                                    <li>Scales for any user login</li>
                                                    <li>Fully customizable</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </SectionCard>
                            ) : null}

                        </div>
                    </div>
            }
        </div>
    );
}
