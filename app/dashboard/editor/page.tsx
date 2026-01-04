"use client";

import { useMemo, useRef, useState } from "react";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import type { PortfolioDraft } from "@/lib/draft";
import Link from "next/link";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { Loader } from "lucide-react";
import { applyDraftPatch, Input, mapApiToDraftPatch, SaveBadge, SectionCard, Textarea } from "./helpers";

export default function EditorPage() {
    const { draft, setDraftSafe, saveState, clearDraftSafe } = useDraftAutosave();

    const [resumeText, setResumeText] = useState("");
    const [extracting, setExtracting] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);

    useDynamicTitle(draft.profile.fullName);

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

    async function extractFromAPI(text: string) {
        setExtracting(true);
        try {
            const res = await fetch("/api/extract", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!res.ok) throw new Error("extract failed");
            const data = await res.json();

            const patch = mapApiToDraftPatch(data);
            setDraftSafe((prev) => applyDraftPatch(prev, patch));
        } finally {
            setExtracting(false);
        }
    }

    function addExperience() {
        setDraftSafe((prev) => ({
            ...prev,
            experience: [
                ...prev.experience,
                { company: "", role: "", start: "", end: "", location: "", highlights: [""] },
            ],
        }));
    }

    function addProject() {
        setDraftSafe((prev) => ({
            ...prev,
            projects: [
                ...prev.projects,
                { name: "", link: "", tech: [], description: "", highlights: [""] },
            ],
        }));
    }

    function addEducation() {
        setDraftSafe((prev) => ({
            ...prev,
            education: [...prev.education, { school: "", degree: "", start: "", end: "", notes: "" }],
        }));
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="space-y-6">
                <div className="flex flex-wrap justify-between items-center">
                    <div className="flex flex-col gap-3">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Editor</h1>
                            <p className="mt-1 text-sm text-white/60">
                                Edit content on the left — preview updates live on the right.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <SaveBadge state={saveState} />
                            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                                Completion: <span className="text-white">{completion}%</span>
                            </div>

                            <a
                                href="/preview"
                                target="_blank"
                                rel="noreferrer"
                                className="hidden md:block rounded-xl bg-white/15 px-6 py-2 text-xs hover:bg-white/20 transition"
                            >
                                Open Portfolio (Preview)
                            </a>
                        </div>
                    </div>
                    <div className="flex my-4 md:my-0 md:mt-2 gap-3">
                        <Link
                            href="/dashboard/publish"
                            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm hover:bg-white/10 transition"
                        >
                            Publish Now
                        </Link>

                        <button
                            onClick={clearDraftSafe}
                            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm hover:bg-white/10 transition"
                        >
                            Clear All
                        </button>
                    </div>
                    <a
                        href="/preview"
                        target="_blank"
                        rel="noreferrer"
                        className="block md:hidden rounded-xl bg-white/15 px-6 py-2 text-sm hover:bg-white/20 transition"
                    >
                        Open Portfolio (Preview)
                    </a>
                </div>

                <SectionCard
                    isResume={true}
                    title="Resume"
                    subtitle="Paste resume text or upload a file. Click Extract to auto-fill sections."
                    right={
                        <div className="flex gap-4">
                            <button
                                onClick={() => fileRef.current?.click()}
                                className={`${extracting ? "hidden" : ""} rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base hover:bg-white/10 transition`}
                            >
                                Upload Resume
                            </button>

                            <button
                                disabled={!resumeText.trim() || extracting}
                                onClick={() => extractFromAPI(resumeText)}
                                className="rounded-xl flex justify-center items-center gap-3 bg-white text-black px-3 py-2 text-base font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {extracting ? "Extracting Data Please wait..." : "Extract → Fill"}
                                {extracting && <Loader className="animate-spin h-5 w-5" />}
                            </button>
                        </div>
                    }
                >
                    <input
                        ref={fileRef}
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setExtracting(true);
                            try {
                                const fd = new FormData();
                                fd.append("file", file);

                                const res = await fetch("/api/extract", { method: "POST", body: fd });
                                const data = await res.json();

                                if (!res.ok) throw new Error(data?.error || "Extract failed");

                                setResumeText(data.text || "");

                                const patch = mapApiToDraftPatch(data);
                                setDraftSafe((prev) => applyDraftPatch(prev, patch));

                            } finally {
                                setExtracting(false);
                                e.target.value = "";
                            }
                        }}
                    />
                </SectionCard>

                {/* Profile */}
                <SectionCard title="Profile" subtitle="These fields show up in your hero section.">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Full name"
                            value={draft.profile.fullName}
                            onChange={(v) => setDraftSafe((p) => ({ ...p, profile: { ...p.profile, fullName: v } }))}
                        />
                        <Input
                            label="Headline"
                            value={draft.profile.headline}
                            onChange={(v) => setDraftSafe((p) => ({ ...p, profile: { ...p.profile, headline: v } }))}
                        />
                        <Input
                            label="Location"
                            value={draft.profile.location}
                            onChange={(v) => setDraftSafe((p) => ({ ...p, profile: { ...p.profile, location: v } }))}
                        />
                        <Input
                            label="Email"
                            value={draft.profile.email}
                            onChange={(v) => setDraftSafe((p) => ({ ...p, profile: { ...p.profile, email: v } }))}
                        />
                        <Input
                            label="Phone"
                            value={draft.profile.phone}
                            onChange={(v) => setDraftSafe((p) => ({ ...p, profile: { ...p.profile, phone: v } }))}
                        />

                        <Input
                            label="Website"
                            value={draft.profile.website}
                            onChange={(v) => setDraftSafe((p) => ({ ...p, profile: { ...p.profile, website: v } }))}
                        />
                        <Input
                            label="GitHub"
                            value={draft.profile.github}
                            onChange={(v) => setDraftSafe((p) => ({ ...p, profile: { ...p.profile, github: v } }))}
                        />
                        <Input
                            label="LinkedIn"
                            value={draft.profile.linkedin}
                            onChange={(v) => setDraftSafe((p) => ({ ...p, profile: { ...p.profile, linkedin: v } }))}
                        />
                    </div>
                    <div className="mt-4">
                        <Textarea
                            label="Summary"
                            value={draft.profile.summary}
                            onChange={(v) => setDraftSafe((p) => ({ ...p, profile: { ...p.profile, summary: v } }))}
                            rows={4}
                        />
                    </div>
                </SectionCard>

                {/* Experience */}
                <SectionCard
                    title="Experience"
                    subtitle="Short bullet highlights. Use metrics when possible."
                    right={
                        <button
                            onClick={addExperience}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
                        >
                            + Add
                        </button>
                    }
                >
                    {draft.experience.length === 0 ? (
                        <div className="text-sm text-white/60">No experience added yet.</div>
                    ) : (
                        <div className="space-y-4">
                            {draft.experience.map((exp, idx) => (
                                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Input
                                            label="Company"
                                            value={exp.company}
                                            onChange={(v) =>
                                                setDraftSafe((p) => {
                                                    const next = structuredClone(p) as PortfolioDraft;
                                                    next.experience[idx].company = v;
                                                    return next;
                                                })
                                            }
                                        />
                                        <Input
                                            label="Role"
                                            value={exp.role}
                                            onChange={(v) =>
                                                setDraftSafe((p) => {
                                                    const next = structuredClone(p) as PortfolioDraft;
                                                    next.experience[idx].role = v;
                                                    return next;
                                                })
                                            }
                                        />
                                        <Input
                                            label="Start"
                                            value={exp.start}
                                            onChange={(v) =>
                                                setDraftSafe((p) => {
                                                    const next = structuredClone(p) as PortfolioDraft;
                                                    next.experience[idx].start = v;
                                                    return next;
                                                })
                                            }
                                        />
                                        <Input
                                            label="End"
                                            value={exp.end}
                                            onChange={(v) =>
                                                setDraftSafe((p) => {
                                                    const next = structuredClone(p) as PortfolioDraft;
                                                    next.experience[idx].end = v;
                                                    return next;
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="mt-3">
                                        <div className="text-xs text-white/60 mb-2">Highlights</div>
                                        <div className="space-y-2">
                                            {exp.highlights.map((h, hIdx) => (
                                                <input
                                                    key={hIdx}
                                                    value={h}
                                                    onChange={(e) =>
                                                        setDraftSafe((p) => {
                                                            const next = structuredClone(p) as PortfolioDraft;
                                                            next.experience[idx].highlights[hIdx] = e.target.value;
                                                            return next;
                                                        })
                                                    }
                                                    placeholder="e.g., Reduced latency by 35% using caching"
                                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none
                                     focus:ring-2 focus:ring-white/10"
                                                />
                                            ))}
                                        </div>

                                        <div className="mt-3 flex gap-2">
                                            <button
                                                onClick={() =>
                                                    setDraftSafe((p) => {
                                                        const next = structuredClone(p) as PortfolioDraft;
                                                        next.experience[idx].highlights.push("");
                                                        return next;
                                                    })
                                                }
                                                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
                                            >
                                                + Highlight
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setDraftSafe((p) => {
                                                        const next = structuredClone(p) as PortfolioDraft;
                                                        next.experience.splice(idx, 1);
                                                        return next;
                                                    })
                                                }
                                                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/15 transition"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </SectionCard>

                {/* Projects */}
                <SectionCard
                    title="Projects"
                    subtitle="Best 2–4. Add impact + links."
                    right={
                        <button
                            onClick={addProject}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
                        >
                            + Add
                        </button>
                    }
                >
                    {draft.projects.length === 0 ? (
                        <div className="text-sm text-white/60">No projects yet.</div>
                    ) : (
                        <div className="space-y-4">
                            {draft.projects.map((pr, idx) => (
                                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Input
                                            label="Project name"
                                            value={pr.name}
                                            onChange={(v) =>
                                                setDraftSafe((p) => {
                                                    const next = structuredClone(p) as PortfolioDraft;
                                                    next.projects[idx].name = v;
                                                    return next;
                                                })
                                            }
                                        />
                                        <Input
                                            label="Link"
                                            value={pr.link}
                                            onChange={(v) =>
                                                setDraftSafe((p) => {
                                                    const next = structuredClone(p) as PortfolioDraft;
                                                    next.projects[idx].link = v;
                                                    return next;
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="mt-3">
                                        <Textarea
                                            label="Description"
                                            value={pr.description}
                                            onChange={(v) =>
                                                setDraftSafe((p) => {
                                                    const next = structuredClone(p) as PortfolioDraft;
                                                    next.projects[idx].description = v;
                                                    return next;
                                                })
                                            }
                                            rows={3}
                                        />
                                    </div>

                                    <div className="mt-3">
                                        <div className="text-xs text-white/60 mb-2">Highlights</div>
                                        <div className="space-y-2">
                                            {pr.highlights.map((h, hIdx) => (
                                                <input
                                                    key={hIdx}
                                                    value={h}
                                                    onChange={(e) =>
                                                        setDraftSafe((p) => {
                                                            const next = structuredClone(p) as PortfolioDraft;
                                                            next.projects[idx].highlights[hIdx] = e.target.value;
                                                            return next;
                                                        })
                                                    }
                                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none
                                     focus:ring-2 focus:ring-white/10"
                                                />
                                            ))}
                                        </div>

                                        <div className="mt-3 flex gap-2">
                                            <button
                                                onClick={() =>
                                                    setDraftSafe((p) => {
                                                        const next = structuredClone(p) as PortfolioDraft;
                                                        next.projects[idx].highlights.push("");
                                                        return next;
                                                    })
                                                }
                                                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
                                            >
                                                + Highlight
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setDraftSafe((p) => {
                                                        const next = structuredClone(p) as PortfolioDraft;
                                                        next.projects.splice(idx, 1);
                                                        return next;
                                                    })
                                                }
                                                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/15 transition"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </SectionCard>

                {/* Skills */}
                <SectionCard title="Skills" subtitle="Comma-separated.">
                    <Input
                        label="Skills"
                        value={draft.skills.join(", ")}
                        onChange={(v) =>
                            setDraftSafe((p) => ({
                                ...p,
                                skills: v
                                    .split(",")
                                    .map((x) => x.trim())
                                    .filter(Boolean),
                            }))
                        }
                        placeholder="React, Next.js, Node.js, TypeScript..."
                    />
                </SectionCard>

                {/* Education */}
                <SectionCard
                    title="Education"
                    subtitle="Add college/degree + years."
                    right={
                        <button
                            onClick={addEducation}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
                        >
                            + Add
                        </button>
                    }
                >
                    {draft.education.length === 0 ? (
                        <div className="text-sm text-white/60">No education added yet.</div>
                    ) : (
                        <div className="space-y-4">
                            {draft.education.map((ed, idx) => (
                                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Input
                                            label="School"
                                            value={ed.school}
                                            onChange={(v) =>
                                                setDraftSafe((p) => {
                                                    const next = structuredClone(p) as PortfolioDraft;
                                                    next.education[idx].school = v;
                                                    return next;
                                                })
                                            }
                                        />
                                        <Input
                                            label="Degree"
                                            value={ed.degree}
                                            onChange={(v) =>
                                                setDraftSafe((p) => {
                                                    const next = structuredClone(p) as PortfolioDraft;
                                                    next.education[idx].degree = v;
                                                    return next;
                                                })
                                            }
                                        />
                                        <Input
                                            label="Start"
                                            value={ed.start}
                                            onChange={(v) =>
                                                setDraftSafe((p) => {
                                                    const next = structuredClone(p) as PortfolioDraft;
                                                    next.education[idx].start = v;
                                                    return next;
                                                })
                                            }
                                        />
                                        <Input
                                            label="End"
                                            value={ed.end}
                                            onChange={(v) =>
                                                setDraftSafe((p) => {
                                                    const next = structuredClone(p) as PortfolioDraft;
                                                    next.education[idx].end = v;
                                                    return next;
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="mt-3">
                                        <Textarea
                                            label="Notes"
                                            value={ed.notes ?? ""}
                                            onChange={(v) =>
                                                setDraftSafe((p) => {
                                                    const next = structuredClone(p) as PortfolioDraft;
                                                    next.education[idx].notes = v;
                                                    return next;
                                                })
                                            }
                                            rows={2}
                                        />
                                    </div>

                                    <div className="mt-3">
                                        <button
                                            onClick={() =>
                                                setDraftSafe((p) => {
                                                    const next = structuredClone(p) as PortfolioDraft;
                                                    next.education.splice(idx, 1);
                                                    return next;
                                                })
                                            }
                                            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/15 transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </SectionCard>
            </div>
        </div>
    );
}
