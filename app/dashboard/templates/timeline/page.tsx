"use client";

import type { PortfolioDraft } from "@/lib/draft";
import { normalizeDraft } from "@/lib/normalizeDraft";
import { defaultDraft } from "@/lib/draft";

function Chip({
    children,
    isLight,
}: {
    children: React.ReactNode;
    isLight: boolean;
}) {
    const cls = isLight
        ? "rounded-full border border-sky-600/15 bg-sky-600/10 px-3 py-1 text-xs text-sky-900/80"
        : "rounded-full border border-sky-300/15 bg-sky-300/10 px-3 py-1 text-xs text-sky-200/90";
    return <span className={cls}>{children}</span>;
}

function PillLink({
    href,
    label,
    isLight,
}: {
    href: string;
    label: string;
    isLight: boolean;
}) {
    const isMail = href.startsWith("mailto:");
    const isTel = href.startsWith("tel:");
    const cls = isLight
        ? "inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/80 hover:bg-black/[0.03] transition shadow-sm"
        : "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition";
    return (
        <a
            href={href}
            target={isMail || isTel ? undefined : "_blank"}
            rel={isMail || isTel ? undefined : "noreferrer"}
            className={cls}
        >
            <span className={isLight ? "text-black/35" : "text-white/40"}>↗</span>
            {label}
        </a>
    );
}

function SectionTitle({
    title,
    subtitle,
    isLight,
}: {
    title: string;
    subtitle?: string;
    isLight: boolean;
}) {
    const t = isLight
        ? "text-sm font-semibold tracking-[0.18em] uppercase text-black/70"
        : "text-sm font-semibold tracking-[0.18em] uppercase text-white/70";
    const s = isLight ? "mt-2 text-sm text-black/55" : "mt-2 text-sm text-white/55";
    const line = isLight ? "bg-black/10" : "bg-white/10";

    return (
        <div className="flex items-start gap-4">
            <div className="min-w-0">
                <div className={t}>{title}</div>
                {subtitle ? <div className={s}>{subtitle}</div> : null}
            </div>
            <div className={`mt-3 h-px flex-1 ${line}`} />
        </div>
    );
}

function TimelineCard({
    title,
    meta,
    body,
    points,
    chips,
    isLight,
}: {
    title: string;
    meta?: string;
    body?: string;
    points?: string[];
    chips?: string[];
    isLight: boolean;
}) {
    const card = isLight
        ? "rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm"
        : "rounded-2xl border border-white/10 bg-white/5 p-6";

    const h3 = isLight
        ? "text-base font-semibold tracking-tight text-black"
        : "text-base font-semibold tracking-tight text-white";

    const m = isLight ? "text-xs text-black/55" : "text-xs text-white/55";
    const p = isLight ? "text-sm text-black/70" : "text-sm text-white/70";

    const pill = isLight
        ? "rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-black/75"
        : "rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/75";

    return (
        <div className={card}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className={h3}>{title}</div>
                {meta ? <div className={m}>{meta}</div> : null}
            </div>

            {body ? <div className={["mt-2", p].join(" ")}>{body}</div> : null}

            {points && points.length ? (
                <ul className={["mt-4 space-y-2", p].join(" ")}>
                    {points.slice(0, 6).map((x, i) => (
                        <li key={i} className="flex gap-2">
                            <span className={isLight ? "text-sky-700/70" : "text-sky-300/70"}>
                                •
                            </span>
                            <span>{x}</span>
                        </li>
                    ))}
                </ul>
            ) : null}

            {chips && chips.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                    {chips.slice(0, 10).map((c) => (
                        <span key={c} className={pill}>
                            {c}
                        </span>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export function TemplateTimeline({ draft }: { draft: PortfolioDraft }) {
    const d = normalizeDraft(draft);
    const p = d.profile;
    const isLight = d.theme === "light";

    const ui = isLight
        ? {
            page: "min-h-screen bg-[#fbfbfd] text-black",
            shell: "mx-auto max-w-7xl px-6 py-12",
            header:
                "relative overflow-hidden rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-[0_0_0_1px_rgba(0,0,0,0.03)]",
            headerInner: "px-6 py-10 md:px-10 md:py-14",
            glow:
                "pointer-events-none absolute -top-28 -right-24 h-[360px] w-[360px] rounded-full bg-sky-500/14 blur-3xl",
            glow2:
                "pointer-events-none absolute -bottom-24 -left-20 h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-3xl",
            name: "text-3xl md:text-5xl font-semibold tracking-tight",
            headline: "mt-3 text-base md:text-lg text-black/70",
            summary: "mt-5 max-w-6xl text-sm md:text-base leading-relaxed text-black/65",
            row: "mt-6 flex flex-wrap gap-2",
            links: "mt-7 flex flex-wrap gap-2",
            main: "mt-10 grid gap-8 lg:grid-cols-[360px_1fr]",
            rail:
                "rounded-3xl border border-black/10 bg-white/70 backdrop-blur p-5 shadow-sm lg:sticky lg:top-6 h-fit",
            railTitle: "text-sm font-semibold text-black/80",
            railText: "mt-2 text-sm text-black/60 leading-relaxed",
            railList: "mt-5 space-y-3",
            railItem:
                "rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm",
            railItemTitle: "text-sm font-medium text-black/80",
            railItemHint: "mt-1 text-xs text-black/55",
            timelineWrap: "space-y-10",
            lane: "relative pl-8",
            line: "absolute left-3 top-0 bottom-0 w-px bg-black/10",
            dot:
                "absolute left-[7px] top-8 h-3.5 w-3.5 rounded-full bg-sky-600 shadow-[0_0_0_4px_rgba(14,165,233,0.14)]",
            groupTitle: "text-lg font-semibold tracking-tight text-black",
            groupSub: "mt-1 text-sm text-black/60",
            groupCards: "mt-5 space-y-4",
            footer:
                "mt-12 rounded-3xl border border-black/10 bg-white/70 backdrop-blur p-8 md:p-10 shadow-sm",
            footerTitle: "text-2xl md:text-3xl font-semibold tracking-tight",
            footerText: "mt-2 text-sm md:text-base text-black/65",
        }
        : {
            page: "min-h-screen bg-[#07070B] text-white",
            shell: "mx-auto max-w-7xl px-6 py-12",
            header:
                "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)]",
            headerInner: "px-6 py-10 md:px-10 md:py-14",
            glow:
                "pointer-events-none absolute -top-28 -right-24 h-[250px] w-[250px] rounded-full bg-sky-500/22 blur-3xl",
            glow2:
                "pointer-events-none absolute -bottom-24 -left-20 h-[250px] w-[250px] rounded-full bg-cyan-500/16 blur-3xl",
            name: "text-3xl md:text-5xl font-semibold tracking-tight",
            headline: "mt-3 text-base md:text-lg text-white/75",
            summary: "mt-5 max-w-6xl text-sm md:text-base leading-relaxed text-white/70",
            row: "mt-6 flex flex-wrap gap-2",
            links: "mt-7 flex flex-wrap gap-2",
            main: "mt-10 grid gap-8 lg:grid-cols-[360px_1fr]",
            rail:
                "rounded-3xl border border-white/10 bg-black/40 backdrop-blur p-5 lg:sticky lg:top-6 h-fit",
            railTitle: "text-sm font-semibold text-white/80",
            railText: "mt-2 text-sm text-white/65 leading-relaxed",
            railList: "mt-5 space-y-3",
            railItem:
                "rounded-2xl border border-white/10 bg-white/5 p-4",
            railItemTitle: "text-sm font-medium text-white/80",
            railItemHint: "mt-1 text-xs text-white/55",
            timelineWrap: "space-y-10",
            lane: "relative pl-8",
            line: "absolute left-3 top-0 bottom-0 w-px bg-white/10",
            dot:
                "absolute left-[7px] top-8 h-3.5 w-3.5 rounded-full bg-sky-400 shadow-[0_0_0_4px_rgba(56,189,248,0.16)]",
            groupTitle: "text-lg font-semibold tracking-tight text-white",
            groupSub: "mt-1 text-sm text-white/60",
            groupCards: "mt-5 space-y-4",
            footer:
                "mt-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 md:p-10",
            footerTitle: "text-2xl md:text-3xl font-semibold tracking-tight",
            footerText: "mt-2 text-sm md:text-base text-white/70",
        };

    const links = [
        p.website ? { label: "Website", href: p.website } : null,
        p.github ? { label: "GitHub", href: p.github } : null,
        p.linkedin ? { label: "LinkedIn", href: p.linkedin } : null,
        p.email ? { label: "Email", href: `mailto:${p.email}` } : null,
        p.phone ? { label: "Call", href: `tel:${p.phone.replace(/\s+/g, "")}` } : null,
    ].filter(Boolean) as Array<{ label: string; href: string }>;

    const years =
        (d.experience || [])
            .map((ex) => ex.start)
            .filter(Boolean)
            .slice(0, 1)[0] || "";

    const highlights = [
        { title: "Now", hint: p.headline || "Add a headline to define your present." },
        {
            title: "Focus",
            hint:
                d.skills.length >= 3
                    ? `${d.skills.slice(0, 3).join(" • ")}`
                    : "Add skills to show your focus areas.",
        },
        {
            title: "Spotlight",
            hint:
                d.projects.length
                    ? `${d.projects.length} projects in portfolio`
                    : "Add projects to show what you’ve shipped.",
        },
    ];

    const timelineGroups = [
        {
            id: "work",
            title: "Experience",
            subtitle: "Roles, ownership, and impact over time.",
            show: d.experience.length > 0,
            cards: d.experience.map((ex) => ({
                title: `${ex.role || "Role"} · ${ex.company || "Company"}`,
                meta: `${ex.start || ""}${ex.end ? ` — ${ex.end}` : ""}${ex.location ? ` • ${ex.location}` : ""
                    }`,
                body: "",
                points: ex.highlights || [],
                chips: [],
            })),
        },
        {
            id: "projects",
            title: "Projects",
            subtitle: "Things I built that prove range and execution.",
            show: d.projects.length > 0,
            cards: d.projects.slice(0, 8).map((pr) => ({
                title: pr.name || "Untitled project",
                meta: pr.link ? "View live / repo" : "",
                body: pr.description || "",
                points: pr.highlights || [],
                chips: pr.tech || [],
            })),
        },
        {
            id: "education",
            title: "Education",
            subtitle: "Foundations and milestones.",
            show: d.education.length > 0,
            cards: d.education.map((ed) => ({
                title: ed.school || "School",
                meta: `${ed.start || ""}${ed.end ? ` — ${ed.end}` : ""}`,
                body: `${ed.degree || "Degree"}${ed.notes ? ` • ${ed.notes}` : ""}`,
                points: [],
                chips: [],
            })),
        },
    ].filter((g) => g.show);

    return (
        <div className={ui.page}>
            <div className={ui.shell}>
                {/* Header */}
                <div className={ui.header}>
                    <div className={ui.glow} />
                    <div className={ui.glow2} />
                    <div className={ui.headerInner}>
                        <h1 className={ui.name}>{p.fullName || "Your Name"}</h1>
                        <p className={ui.headline}>
                            {p.headline || "A timeline-style portfolio that tells your story with clarity."}
                        </p>
                        <p className={ui.summary}>
                            {p.summary ||
                                "This template is built for storytelling. It highlights growth, milestones, and proof of work with a clean, readable timeline."}
                        </p>

                        <div className={ui.row}>
                            {p.location ? <Chip isLight={isLight}>{p.location}</Chip> : null}
                            {years ? <Chip isLight={isLight}>since {years}</Chip> : null}
                            {d.projects.length ? (
                                <Chip isLight={isLight}>{d.projects.length} projects</Chip>
                            ) : null}
                        </div>

                        {links.length ? (
                            <div className={ui.links}>
                                {links.slice(0, 5).map((l) => (
                                    <PillLink key={l.href} href={l.href} label={l.label} isLight={isLight} />
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Body */}
                <div className={ui.main}>
                    {/* Left rail */}
                    <aside className={ui.rail}>
                        <div className={ui.railTitle}>Story Snapshot</div>
                        <div className={ui.railText}>
                            A quick overview recruiters can scan in 10 seconds.
                        </div>

                        <div className={ui.railList}>
                            {highlights.map((h) => (
                                <div key={h.title} className={ui.railItem}>
                                    <div className={ui.railItemTitle}>{h.title}</div>
                                    <div className={ui.railItemHint}>{h.hint}</div>
                                </div>
                            ))}
                        </div>

                        {d.skills.length ? (
                            <div className="mt-6">
                                <SectionTitle
                                    title="Core Skills"
                                    subtitle="The tools I reach for most."
                                    isLight={isLight}
                                />
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {d.skills.slice(0, 24).map((s) => (
                                        <Chip key={s} isLight={isLight}>
                                            {s}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </aside>

                    {/* Timeline */}
                    <main className={ui.timelineWrap}>
                        {timelineGroups.map((g) => (
                            <section key={g.id} id={g.id} className={ui.lane}>
                                <div className={ui.line} />
                                <div className={ui.dot} />
                                <div>
                                    <div className={ui.groupTitle}>{g.title}</div>
                                    <div className={ui.groupSub}>{g.subtitle}</div>
                                    <div className={ui.groupCards}>
                                        {g.cards.map((c, idx) => (
                                            <TimelineCard
                                                key={`${g.id}-${idx}`}
                                                title={c.title}
                                                meta={c.meta}
                                                body={c.body}
                                                points={c.points}
                                                chips={c.chips}
                                                isLight={isLight}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        ))}
                    </main>
                </div>

                {/* CTA footer */}
                <div className={ui.footer}>
                    <div className={ui.footerTitle}>Want the full story?</div>
                    <div className={ui.footerText}>
                        Reach out and I’ll walk you through the decisions, tradeoffs, and results behind
                        the work.
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {p.email ? (
                            <PillLink
                                href={`mailto:${p.email}`}
                                label="Email me"
                                isLight={isLight}
                            />
                        ) : null}
                        {p.linkedin ? (
                            <PillLink href={p.linkedin} label="LinkedIn" isLight={isLight} />
                        ) : null}
                        {p.github ? <PillLink href={p.github} label="GitHub" isLight={isLight} /> : null}
                        {p.website ? (
                            <PillLink href={p.website} label="Website" isLight={isLight} />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return <TemplateTimeline draft={defaultDraft} />;
}
