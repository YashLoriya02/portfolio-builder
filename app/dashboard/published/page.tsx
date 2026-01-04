"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    ExternalLink,
    Copy,
    Search,
    ArrowUpDown,
    Globe,
    Github,
    Trash2,
    Check,
} from "lucide-react";
import Link from "next/link";
import { PublishedProject, SortMode } from "@/lib/draft";
import { deleteProject, providerBadgeClass, providerFromUrl, safeUrl, shortUrl, timeAgo } from "./helpers";

export default function PublishedPage() {
    const [items, setItems] = useState<PublishedProject[]>([]);
    const [q, setQ] = useState("");
    const [sort, setSort] = useState<SortMode>("newest");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selected, setSelected] = useState<PublishedProject | null>(null);

    async function fetchProjects(): Promise<void> {
        const userId = localStorage.getItem("pb_user_id");

        try {
            const res = await fetch(`/api/project/${userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const pData = await res.json();
            setItems(pData.data as PublishedProject[])
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, []);

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        let list = !qq
            ? items
            : items.filter((p) => p.repoName.toLowerCase().includes(qq));

        list = [...list].sort((a, b) => {
            if (sort === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
            if (sort === "oldest") return +new Date(a.createdAt) - +new Date(b.createdAt);
            if (sort === "az") return a.repoName.localeCompare(b.repoName);
            return b.repoName.localeCompare(a.repoName);
        });

        return list;
    }, [items, q, sort]);

    async function copy(text: string, label: string) {
        await navigator.clipboard.writeText(text);
        toast.success(`${label} copied`);
    }

    function openInNewTab(url: string) {
        const u = safeUrl(url);
        if (!u) return;
        window.open(u, "_blank", "noopener,noreferrer");
    }

    function requestRemove(p: PublishedProject) {
        setSelected(p);
        setConfirmOpen(true);
    }

    async function removeLocal() {
        if (!selected) return;
        const next = items.filter((x) => x.githubUrl !== selected.githubUrl);
        setItems(next);
        await deleteProject(selected.githubUrl);
        setConfirmOpen(false);
        toast.success("Removed from local list");
        setSelected(null);
    }

    function openAll() {
        if (!filtered.length) return;
        filtered.slice(0, 10).forEach((p) => {
            openInNewTab(p.deployUrl);
            openInNewTab(p.githubUrl);
        });
        toast.message("Opening links…", { description: "Opened up to 10 projects (live + repo)." });
    }

    if (!items.length) {
        return (
            <div className="max-w-6xl mx-auto px-4 space-y-6">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Published Projects</h1>
                        <p className="mt-1 text-sm text-white/60">
                            Your saved live links and repos will show up here.
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center">
                            <Globe className="h-5 w-5 text-white/80" />
                        </div>
                        <div>
                            <div className="text-lg font-semibold">Nothing here yet</div>
                            <div className="mt-1 text-sm text-white/60">
                                Publish a repo and save your live URL. We’ll keep it in this device.
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                                <a
                                    href="/dashboard/publish"
                                    className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Go to Publish
                                </a>
                                <a
                                    href="/dashboard/templates"
                                    className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Go to Templates
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const total = items.length;
    const showing = filtered.length;

    return (
        <div className="max-w-6xl mx-auto px-4 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Published Projects</h1>
                    <p className="mt-1 text-sm text-white/60">
                        Manage your live portfolios and repositories (saved locally on this device).
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/75">
                        <span className="text-white/90 font-medium">{total}</span> total
                        <span className="opacity-40">•</span>
                        <span className="text-white/90 font-medium">{showing}</span> showing
                    </div>

                    <button
                        onClick={openAll}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Open links
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search by repo name…"
                            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                            <ArrowUpDown className="h-4 w-4" />
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortMode)}
                                className="bg-transparent outline-none text-sm"
                            >
                                <option className="text-black/70" value="newest">Newest</option>
                                <option className="text-black/70" value="oldest">Oldest</option>
                                <option className="text-black/70" value="az">A → Z</option>
                                <option className="text-black/70" value="za">Z → A</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {showing === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                    <div className="text-lg font-semibold">No matches</div>
                    <div className="mt-1 text-sm text-white/60">Try a different keyword.</div>
                </div>
            ) : null}

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map((p) => {
                    const provider = providerFromUrl(p.deployUrl);

                    return (
                        <div
                            key={p.githubUrl}
                            className="group rounded-3xl border border-white/10 bg-white/4 p-5 hover:bg-white/5 transition"
                        >
                            {/* Top row */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className="h-12 w-12 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-semibold text-white/80">
                                            {(p.repoName || "P").slice(0, 1).toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <div className="text-lg font-semibold truncate">{p.repoName}</div>
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${providerBadgeClass(
                                                    provider
                                                )}`}
                                            >
                                                {provider}
                                            </span>
                                        </div>

                                        <div
                                            className="mt-1 text-xs text-white/60"
                                            title={new Date(p.createdAt).toLocaleString()}
                                        >
                                            Published {timeAgo(p.createdAt)} • {new Date(p.createdAt).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {
                                        p.isDeployed && <button
                                            onClick={() => openInNewTab(p.deployUrl)}
                                            className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
                                            title="Open live"
                                        >
                                            <Globe className="h-4 w-4 text-white/80" />
                                        </button>
                                    }
                                    <button
                                        onClick={() => openInNewTab(p.githubUrl)}
                                        className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
                                        title="Open repo"
                                    >
                                        <Github className="h-4 w-4 text-white/80" />
                                    </button>

                                    {/* local-only menu */}
                                    <div className="relative">
                                        <button
                                            onClick={() => requestRemove(p)}
                                            className="rounded-xl border border-red-500 bg-white/5 p-2 hover:bg-white/10 transition"
                                            title="Remove from local list"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="mt-4 space-y-3">
                                {
                                    p.isDeployed &&
                                    <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                                        <div className="text-xs text-white/60 mb-1 flex items-center justify-between">
                                            <span>Live URL</span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => copy(safeUrl(p.deployUrl), "Live URL")}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10 transition"
                                                >
                                                    <Copy className="h-3.5 w-3.5" />
                                                    Copy
                                                </button>
                                            </div>
                                        </div>

                                        <a
                                            href={safeUrl(p.deployUrl)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm underline text-white/85 hover:text-white break-all"
                                        >
                                            {shortUrl(safeUrl(p.deployUrl))}
                                        </a>
                                    </div>
                                }

                                <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                                    <div className="text-xs text-white/60 mb-1 flex items-center justify-between">
                                        <span>GitHub Repo</span>
                                        <button
                                            onClick={() => copy(safeUrl(p.githubUrl), "Repo URL")}
                                            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10 transition"
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                            Copy
                                        </button>
                                    </div>

                                    <a
                                        href={safeUrl(p.githubUrl)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm underline text-white/85 hover:text-white break-all"
                                    >
                                        {shortUrl(safeUrl(p.githubUrl))}
                                    </a>
                                </div>
                            </div>

                            {/* Bottom actions */}
                            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                {
                                    p.isDeployed
                                        ? <a
                                            href={safeUrl(p.deployUrl)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            Visit Live
                                        </a>
                                        : <Link
                                            href={`/dashboard/publish?githubUrl=${p.githubUrl}`}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                                        >
                                            Deploy Now
                                        </Link>
                                }

                                <a
                                    href={safeUrl(p.githubUrl)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                                >
                                    <Github className="h-4 w-4" />
                                    View Repo
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Confirm remove (local only) */}
            {confirmOpen && selected ? (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 backdrop-blur bg-black/30"
                        onClick={() => {
                            setConfirmOpen(false);
                            setSelected(null);
                        }}
                    />

                    <div className="absolute left-1/2 top-1/2 w-[90%] md:max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/25 bg-black py-6 px-8">
                        <div className="text-lg font-semibold">Remove from list?</div>
                        <div className="mt-1 text-sm text-white/60">
                            This only removes it from this device. It won’t delete your GitHub repo or deployment.
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                            <div className="text-sm font-medium">{selected.repoName}</div>
                            <div className="mt-1 text-xs text-white/60 break-all">
                                {shortUrl(safeUrl(selected.deployUrl))}
                            </div>
                        </div>

                        <div className="mt-5 flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setConfirmOpen(false);
                                    setSelected(null);
                                }}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={removeLocal}
                                className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                            >
                                <Check className="h-4 w-4" />
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
