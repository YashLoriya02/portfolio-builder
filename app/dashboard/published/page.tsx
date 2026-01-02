"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";

type PublishedProject = {
    repoName: string;
    repoUrl: string;
    projectUrl: string;
    publishedAt: string;
    templateId?: string;
    vercelProjectName?: string;
};

const STORAGE_KEY = "portfolio_builder:published_projects:v1";

function readStorage(): PublishedProject[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as PublishedProject[]) : [];
    } catch {
        return [];
    }
}

function writeStorage(list: PublishedProject[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function shortUrl(u: string) {
    try {
        const url = new URL(u);
        return `${url.host}${url.pathname}`.replace(/\/$/, "");
    } catch {
        return u;
    }
}

export default function PublishedPage() {
    const [items, setItems] = useState<PublishedProject[]>([]);
    const [q, setQ] = useState("");
    const [busyKey, setBusyKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<PublishedProject | null>(null);

    useEffect(() => {
        setItems(readStorage());
    }, []);

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        if (!qq) return items;
        return items.filter((p) => p.repoName.toLowerCase().includes(qq));
    }, [items, q]);

    async function copy(text: string) {
        await navigator.clipboard.writeText(text);
        toast.success("Link Copied!");
    }

    function clearHistory() {
        localStorage.removeItem(STORAGE_KEY);
        setItems([]);

        toast.success("Published projects cleared");
    }

    async function confirmDelete() {
        if (!selectedProject) return;

        const p = selectedProject;
        const projectName = (p.vercelProjectName || p.repoName).trim();

        setBusyKey(p.repoUrl);
        toast.loading("Deleting project from Vercel…", { id: p.repoUrl });

        try {
            const res = await fetch("/api/publish/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectName }),
            });

            if (!res.ok) {
                toast.error("Failed to delete project", { id: p.repoUrl });
                return;
            }

            const next = items.filter((x) => x.repoUrl !== p.repoUrl);
            setItems(next);
            writeStorage(next);

            toast.success("Project deleted successfully", { id: p.repoUrl });
        } catch {
            toast.error("Network error while deleting", { id: p.repoUrl });
        } finally {
            setBusyKey(null);
            setConfirmOpen(false);
            setSelectedProject(null);
        }
    }

    if (!items.length) {
        return (
            <div className="max-w-full mx-auto px-4">
                <h1 className="text-2xl font-semibold">Published Projects</h1>
                <p className="mt-3 text-white/60">
                    You haven't published any portfolio yet.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-auto px-4 space-y-6">
            <ConfirmDialog
                open={confirmOpen}
                title={`Delete "${selectedProject?.repoName}"?`}
                description={
                    `This will permanently delete the project and all its deployments.\n` +
                    `Your local list will also be updated.\n\n` +
                    `This action cannot be undone.`
                }
                confirmText="Delete project"
                loading={busyKey === selectedProject?.repoUrl}
                onClose={() => {
                    if (!busyKey) {
                        setConfirmOpen(false);
                        setSelectedProject(null);
                    }
                }}
                onConfirm={confirmDelete}
            />

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">Published Projects</h1>
                    <p className="mt-1 text-sm text-white/60">
                        Manage your live portfolios and repositories.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search by repo name…"
                        className="w-64 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none
                       focus:ring-2 focus:ring-white/10"
                    />
                    <button
                        onClick={clearHistory}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
                    >
                        Clear history
                    </button>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm text-rose-200">
                    {error}
                </div>
            ) : null}
            {
                filtered.length === 0
                    ? (
                        <div className="max-w-full flex justify-center mt-20 px-4 h-full">
                            <p className="my-auto text-white/60">
                                You haven't published any portfolio yet.
                            </p>
                        </div>
                    ) : <></>
            }

            <div className="space-y-4">
                {filtered.map((p) => {
                    const deleting = busyKey === p.repoUrl;

                    return (
                        <div
                            key={p.repoUrl}
                            className="rounded-2xl w-full border border-white/10 bg-white/5 p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-lg font-medium">{p.repoName}</div>
                                    <div className="mt-1 text-xs text-white/60">
                                        Published {new Date(p.publishedAt).toLocaleString()}
                                        {p.templateId ? (
                                            <>
                                                {" "}
                                                • Template <span className="text-white/80">{p.templateId}</span>
                                            </>
                                        ) : null}
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedProject(p);
                                        setConfirmOpen(true);
                                    }}
                                    disabled={deleting}
                                    className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-8 py-2 text-xs text-rose-200 hover:bg-rose-500/15 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Delete from Vercel + remove from this list"
                                >
                                    {deleting ? "Deleting…" : "Delete"}
                                </button>
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                                    <div className="text-xs text-white/60 mb-1">Live URL</div>
                                    <div className="flex items-center justify-between gap-3">
                                        <a
                                            href={p.projectUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm underline text-white/85 hover:text-white break-all"
                                        >
                                            {shortUrl(p.projectUrl)}
                                        </a>
                                        <button
                                            onClick={() => copy(p.projectUrl)}
                                            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs hover:bg-white/10 transition"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                                    <div className="text-xs text-white/60 mb-1">GitHub Repo</div>
                                    <div className="flex items-center justify-between gap-3">
                                        <a
                                            href={p.repoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm underline text-white/85 hover:text-white break-all"
                                        >
                                            {shortUrl(p.repoUrl)}
                                        </a>
                                        <button
                                            onClick={() => copy(p.repoUrl)}
                                            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs hover:bg-white/10 transition"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 justify-end flex flex-col sm:flex-row gap-3">
                                <a
                                    href={p.projectUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-xl bg-white text-black px-4 py-2 text-sm text-center hover:opacity-90 transition"
                                >
                                    Visit Live Portfolio
                                </a>

                                <a
                                    href={p.repoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-center hover:bg-white/10 transition"
                                >
                                    View GitHub Repo
                                </a>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                                    Coming soon: Redeploy • Custom domain • Analytics
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
