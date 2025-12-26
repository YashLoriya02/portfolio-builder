"use client";

import type { PortfolioDraft } from "@/lib/draft";

/**
 * Pure renderer: given a draft, render the selected template.
 * Used in:
 *  - LivePreview (Editor split panel)
 *  - Templates modal preview
 */
export default function TemplatePreview({ draft }: { draft: PortfolioDraft }) {
    return (
        <>
            {draft.templateId === "glass" && <GlassTemplate draft={draft} />}
            {draft.templateId === "minimal" && <MinimalTemplate draft={draft} />}
            {draft.templateId === "neo" && <NeoTemplate draft={draft} />}
            {draft.templateId === "classic" && <ClassicTemplate draft={draft} />}
        </>
    );
}

/* ----------------------------- GLASS (cards) ----------------------------- */
function GlassTemplate({ draft }: { draft: PortfolioDraft }) {
    const p = draft.profile;

    return (
        <div className="space-y-6 text-white">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/35 p-6">
                <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

                <div className="relative">
                    <div className="text-3xl font-semibold tracking-tight">{p.fullName || "Your Name"}</div>
                    <div className="mt-1 text-sm text-white/70">{p.headline || "Your headline"}</div>
                    <div className="mt-4 text-sm text-white/70 leading-relaxed">
                        {p.summary || "Short punchy summary here…"}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {(draft.skills.length ? draft.skills : ["React", "Next.js", "TypeScript"])
                            .slice(0, 8)
                            .map((s) => (
                                <span key={s} className="text-[11px] rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/70">
                                    {s}
                                </span>
                            ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Block title="Experience">
                    {(draft.experience.length
                        ? draft.experience
                        : [
                            {
                                company: "Company",
                                role: "Role",
                                start: "Start",
                                end: "End",
                                highlights: ["Add highlights in editor."],
                            },
                        ]
                    ).slice(0, 2).map((e: any, idx: number) => (
                        <div key={idx} className="rounded-2xl border border-white/10 bg-white/3 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="font-medium">{e.role || "Role"}</div>
                                    <div className="text-sm text-white/70">{e.company || "Company"}</div>
                                </div>
                                <div className="text-xs text-white/60">
                                    {e.start} — {e.end}
                                </div>
                            </div>
                            <ul className="mt-3 list-disc pl-5 text-sm text-white/70 space-y-1">
                                {(e.highlights?.filter(Boolean).length ? e.highlights : ["Add highlights."])
                                    .slice(0, 3)
                                    .map((h: string, i: number) => (
                                        <li key={i}>{h}</li>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </Block>

                <Block title="Projects">
                    {(draft.projects.length
                        ? draft.projects
                        : [
                            {
                                name: "Project",
                                description: "Add projects in editor.",
                                highlights: ["Highlight 1", "Highlight 2"],
                                tech: ["Next.js", "Tailwind"],
                            },
                        ]
                    ).slice(0, 2).map((pr: any, idx: number) => (
                        <div key={idx} className="rounded-2xl border border-white/10 bg-white/3 p-4">
                            <div className="font-medium">{pr.name || "Project"}</div>
                            <div className="mt-1 text-sm text-white/70">{pr.description || ""}</div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {(pr.tech || []).slice(0, 6).map((t: string) => (
                                    <span key={t} className="text-[11px] rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/70">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </Block>
            </div>
        </div>
    );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="mt-4 space-y-3">{children}</div>
        </div>
    );
}

/* --------------------------- MINIMAL (paper) ---------------------------- */
function MinimalTemplate({ draft }: { draft: PortfolioDraft }) {
    const p = draft.profile;

    return (
        <div className="rounded-3xl bg-white text-black p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <div className="flex items-start justify-between gap-6">
                <div>
                    <div className="text-4xl font-semibold tracking-tight">{p.fullName || "Your Name"}</div>
                    <div className="mt-2 text-sm text-black/70">{p.headline || "Your headline"}</div>
                </div>

                <div className="text-xs text-black/70 space-y-1 text-right">
                    <div>{p.email || "email@domain.com"}</div>
                    <div>{p.location || "Location"}</div>
                    <div>{p.github ? "GitHub" : "github.com/you"}</div>
                    <div>{p.linkedin ? "LinkedIn" : "linkedin.com/in/you"}</div>
                </div>
            </div>

            <div className="mt-6 text-sm leading-relaxed text-black/80">
                {p.summary || "Minimal template: typography-first. Clean and recruiter-friendly."}
            </div>

            <hr className="my-8 border-black/10" />

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
                <div>
                    <H>Experience</H>
                    <div className="space-y-4">
                        {(draft.experience.length
                            ? draft.experience
                            : [
                                {
                                    company: "Company",
                                    role: "Role",
                                    start: "Start",
                                    end: "End",
                                    highlights: ["Add highlights in editor."],
                                },
                            ]
                        ).slice(0, 2).map((e: any, idx: number) => (
                            <div key={idx}>
                                <div className="flex items-baseline justify-between gap-4">
                                    <div className="font-medium">
                                        {e.role || "Role"} · {e.company || "Company"}
                                    </div>
                                    <div className="text-xs text-black/60">
                                        {e.start} — {e.end}
                                    </div>
                                </div>
                                <ul className="mt-2 list-disc pl-5 text-sm text-black/70 space-y-1">
                                    {(e.highlights?.filter(Boolean).length ? e.highlights : ["Add highlights."])
                                        .slice(0, 3)
                                        .map((h: string, i: number) => (
                                            <li key={i}>{h}</li>
                                        ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <H>Skills</H>
                    <div className="flex flex-wrap gap-2">
                        {(draft.skills.length ? draft.skills : ["React", "Next.js", "TypeScript"]).slice(0, 10).map((s) => (
                            <span key={s} className="text-[11px] rounded-full border border-black/10 bg-black/5 px-2 py-1 text-black/70">
                                {s}
                            </span>
                        ))}
                    </div>

                    <div className="mt-8">
                        <H>Projects</H>
                        <div className="space-y-3">
                            {(draft.projects.length
                                ? draft.projects
                                : [{ name: "Project", description: "Add projects in editor." }]
                            ).slice(0, 3).map((pr: any, idx: number) => (
                                <div key={idx}>
                                    <div className="font-medium">{pr.name || "Project"}</div>
                                    <div className="text-sm text-black/70">{pr.description || ""}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function H({ children }: { children: React.ReactNode }) {
    return <div className="text-xs font-semibold tracking-widest uppercase text-black/70 mb-3">{children}</div>;
}

/* ------------------------------ NEO (bold) ------------------------------ */
function NeoTemplate({ draft }: { draft: PortfolioDraft }) {
    const p = draft.profile;

    return (
        <div className="rounded-3xl border border-white/10 bg-[#070707] text-white p-7">
            <div className="flex items-start justify-between gap-6">
                <div>
                    <div className="text-5xl font-extrabold tracking-tight">{p.fullName || "Your Name"}</div>
                    <div className="mt-2 text-sm text-white/70">{p.headline || "Your headline"}</div>
                </div>
                <div className="text-xs text-white/60 text-right">
                    <div className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span>Available</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
                <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                    <div className="text-xs uppercase tracking-widest text-white/60">Stack</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {(draft.skills.length ? draft.skills : ["React", "Next.js", "TypeScript", "Node"]).slice(0, 12).map((s) => (
                            <span key={s} className="text-[11px] rounded-full border border-white/15 bg-white/10 px-2 py-1 text-white/80">
                                {s}
                            </span>
                        ))}
                    </div>

                    <div className="mt-6 border-t border-white/10 pt-5">
                        <div className="text-xs uppercase tracking-widest text-white/60">Summary</div>
                        <div className="mt-2 text-sm text-white/70 leading-relaxed">
                            {p.summary || "Neo template: bold, high contrast, creator-style."}
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <NeoSection title="Experience">
                        {(draft.experience.length
                            ? draft.experience
                            : [
                                {
                                    company: "Company",
                                    role: "Role",
                                    start: "Start",
                                    end: "End",
                                    highlights: ["Add highlights in editor."],
                                },
                            ]
                        ).slice(0, 2).map((e: any, idx: number) => (
                            <NeoItem key={idx} title={`${e.role || "Role"} @ ${e.company || "Company"}`} meta={`${e.start} — ${e.end}`}>
                                <ul className="list-disc pl-5 text-sm text-white/70 space-y-1">
                                    {(e.highlights?.filter(Boolean).length ? e.highlights : ["Add highlights."])
                                        .slice(0, 3)
                                        .map((h: string, i: number) => (
                                            <li key={i}>{h}</li>
                                        ))}
                                </ul>
                            </NeoItem>
                        ))}
                    </NeoSection>

                    <NeoSection title="Projects">
                        {(draft.projects.length
                            ? draft.projects
                            : [{ name: "Project", description: "Add projects in editor." }]
                        ).slice(0, 2).map((pr: any, idx: number) => (
                            <NeoItem key={idx} title={pr.name || "Project"} meta={pr.link ? "Link" : "—"}>
                                <div className="text-sm text-white/70">{pr.description || ""}</div>
                            </NeoItem>
                        ))}
                    </NeoSection>
                </div>
            </div>
        </div>
    );
}

function NeoSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
            <div className="text-xs font-semibold tracking-widest uppercase">{title}</div>
            <div className="mt-4 space-y-4">{children}</div>
        </div>
    );
}

function NeoItem({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
    return (
        <div className="border-l-2 border-white/15 pl-4">
            <div className="flex items-start justify-between gap-3">
                <div className="font-medium">{title}</div>
                <div className="text-xs text-white/60">{meta}</div>
            </div>
            <div className="mt-2">{children}</div>
        </div>
    );
}

/* --------------------------- CLASSIC (formal) --------------------------- */
function ClassicTemplate({ draft }: { draft: PortfolioDraft }) {
    const p = draft.profile;

    return (
        <div className="rounded-3xl border border-black/10 bg-[#fbfbfb] text-black p-7">
            <div className="text-center">
                <div className="text-3xl font-semibold">{p.fullName || "Your Name"}</div>
                <div className="mt-1 text-sm text-black/70">{p.headline || "Your headline"}</div>
                <div className="mt-3 text-xs text-black/60">
                    {[
                        p.location || "Location",
                        p.email || "email@domain.com",
                        p.github ? "GitHub" : "",
                        p.linkedin ? "LinkedIn" : "",
                    ]
                        .filter(Boolean)
                        .join(" • ")}
                </div>
            </div>

            <div className="my-6 border-t border-black/10" />

            <div className="text-sm text-black/80 leading-relaxed">
                {p.summary || "Classic template: formal, neat spacing, traditional resume-like layout."}
            </div>

            <div className="mt-6 space-y-6">
                <ClassicSection title="Experience">
                    {(draft.experience.length
                        ? draft.experience
                        : [
                            {
                                company: "Company",
                                role: "Role",
                                start: "Start",
                                end: "End",
                                highlights: ["Add highlights in editor."],
                            },
                        ]
                    ).slice(0, 2).map((e: any, idx: number) => (
                        <div key={idx}>
                            <div className="flex items-baseline justify-between gap-4">
                                <div className="font-medium">{e.role || "Role"}</div>
                                <div className="text-xs text-black/60">
                                    {e.start} — {e.end}
                                </div>
                            </div>
                            <div className="text-sm text-black/70">{e.company || "Company"}</div>
                            <ul className="mt-2 list-disc pl-5 text-sm text-black/70 space-y-1">
                                {(e.highlights?.filter(Boolean).length ? e.highlights : ["Add highlights."])
                                    .slice(0, 3)
                                    .map((h: string, i: number) => (
                                        <li key={i}>{h}</li>
                                    ))}
                            </ul>
                        </div>
                    ))}
                </ClassicSection>

                <ClassicSection title="Projects">
                    {(draft.projects.length ? draft.projects : [{ name: "Project", description: "Add projects in editor." }])
                        .slice(0, 2)
                        .map((pr: any, idx: number) => (
                            <div key={idx}>
                                <div className="font-medium">{pr.name || "Project"}</div>
                                <div className="text-sm text-black/70">{pr.description || ""}</div>
                            </div>
                        ))}
                </ClassicSection>

                <ClassicSection title="Skills">
                    <div className="text-sm text-black/70">
                        {(draft.skills.length ? draft.skills : ["React", "Next.js", "TypeScript"]).join(", ")}
                    </div>
                </ClassicSection>
            </div>
        </div>
    );
}

function ClassicSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-black/70">{title}</div>
            <div className="mt-3 space-y-4">{children}</div>
        </div>
    );
}
