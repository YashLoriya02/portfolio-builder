"use client";

import type { PortfolioDraft } from "@/lib/draft";
import { normalizeDraft } from "@/lib/normalizeDraft";
import { defaultDraft } from "@/lib/draft";
import { useMemo } from "react";

function Chip({
    children,
    isLight,
}: {
    children: React.ReactNode;
    isLight: boolean;
}) {
    const cls = isLight
        ? "rounded-full border border-violet-600/15 bg-violet-600/10 px-3 py-1 text-xs text-violet-900/80"
        : "rounded-full border border-violet-300/15 bg-violet-300/10 px-3 py-1 text-xs text-violet-200/90";

    return <span className={cls}>{children}</span>;
}

function PrimaryButton({
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
        ? "inline-flex items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-black/90 transition"
        : "inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black shadow-sm hover:bg-white/90 transition";

    return (
        <a
            href={href}
            target={isMail || isTel ? undefined : "_blank"}
            rel={isMail || isTel ? undefined : "noreferrer"}
            className={cls}
        >
            {label}
        </a>
    );
}

function SecondaryButton({
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
        ? "inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black/80 hover:bg-black/[0.03] transition shadow-sm"
        : "inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition";

    return (
        <a
            href={href}
            target={isMail || isTel ? undefined : "_blank"}
            rel={isMail || isTel ? undefined : "noreferrer"}
            className={cls}
        >
            {label}
        </a>
    );
}

function Section({
    id,
    title,
    subtitle,
    children,
    isLight,
}: {
    id: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    isLight: boolean;
}) {
    const h2 = isLight
        ? "text-sm font-semibold tracking-[0.18em] uppercase text-black/70"
        : "text-sm font-semibold tracking-[0.18em] uppercase text-white/70";

    const sub = isLight ? "mt-2 text-sm text-black/55" : "mt-2 text-sm text-white/55";
    const line = isLight ? "bg-black/10" : "bg-white/10";

    return (
        <section id={id} className="scroll-mt-24">
            <div className="flex items-center gap-4">
                <h2 className={h2}>{title}</h2>
                <div className={`h-px flex-1 ${line}`} />
            </div>
            {subtitle ? <p className={sub}>{subtitle}</p> : null}
            <div className="mt-6">{children}</div>
        </section>
    );
}

function ProjectCard({
    title,
    desc,
    highlights,
    tech,
    link,
    isLight,
}: {
    title: string;
    desc?: string;
    highlights?: string[];
    tech?: string[];
    link?: string | null;
    isLight: boolean;
}) {
    const card = isLight
        ? "group rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm hover:shadow-md transition"
        : "group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition";

    const titleCls = isLight
        ? "text-lg font-semibold tracking-tight text-black"
        : "text-lg font-semibold tracking-tight text-white";

    const body = isLight ? "text-sm text-black/70" : "text-sm text-white/70";
    const dim = isLight ? "text-black/50" : "text-white/55";

    const pill = isLight
        ? "rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-xs text-black/75"
        : "rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-white/75";

    const icon = isLight ? "text-black/60" : "text-white/65";

    return (
        <article className={card}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className={titleCls}>{title}</h3>
                    {desc ? <p className={["mt-2", body].join(" ")}>{desc}</p> : null}
                </div>

                {link ? (
                    <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className={[
                            "shrink-0 rounded-xl border px-3 py-2 text-sm transition",
                            isLight
                                ? "border-black/10 bg-white hover:bg-black/3 text-black/70"
                                : "border-white/10 bg-white/5 hover:bg-white/10 text-white/70",
                        ].join(" ")}
                        aria-label="Open project"
                        title="Open project"
                    >
                        <span className={icon}>↗</span>
                    </a>
                ) : null}
            </div>

            {highlights && highlights.length ? (
                <ul className={["mt-4 space-y-2", body].join(" ")}>
                    {highlights.slice(0, 4).map((h, idx) => (
                        <li key={idx} className="flex gap-2">
                            <span className={dim}>•</span>
                            <span>{h}</span>
                        </li>
                    ))}
                </ul>
            ) : null}

            {tech && tech.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                    {tech.slice(0, 10).map((t) => (
                        <span key={t} className={pill}>
                            {t}
                        </span>
                    ))}
                </div>
            ) : null}

            <div
                className={[
                    "mt-6 h-px w-full transition",
                    isLight ? "bg-black/5 group-hover:bg-black/10" : "bg-white/5 group-hover:bg-white/10",
                ].join(" ")}
            />
            <div className={["mt-4 flex items-center justify-between", dim].join(" ")}>
                <span>Featured</span>
                <span className={isLight ? "text-violet-700/80" : "text-violet-300/80"}>Spotlight</span>
            </div>
        </article>
    );
}

export function TemplateSpotlight({ draft }: { draft: PortfolioDraft }) {
    const d = normalizeDraft(draft);
    const p = d.profile;

    const isLight = d.theme === "light";

    const ui = isLight
        ? {
            page: "min-h-screen bg-[#fbfbfd] text-black",
            shell: "mx-auto max-w-7xl px-6 py-12",
            heroWrap:
                "relative overflow-hidden rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-[0_0_0_1px_rgba(0,0,0,0.03)]",
            heroInner: "px-6 py-12 md:px-10 md:py-16",
            glow:
                "pointer-events-none absolute -top-24 -right-28 h-[380px] w-[380px] rounded-full bg-violet-500/15 blur-3xl",
            glow2:
                "pointer-events-none absolute -bottom-24 -left-20 h-[340px] w-[340px] rounded-full bg-fuchsia-500/10 blur-3xl",
            name: "text-4xl md:text-6xl font-semibold tracking-tight",
            headline: "mt-4 text-lg md:text-xl text-black/70",
            summary: "mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-black/65",
            quick: "mt-7 flex flex-wrap gap-2",
            chipsRow: "mt-4 flex flex-wrap gap-2",
            actions: "mt-8 flex flex-wrap gap-3",
            nav:
                "sticky top-4 z-10 mt-8 rounded-2xl border border-black/10 bg-white/70 backdrop-blur px-4 py-3 shadow-sm",
            navText: "flex flex-wrap gap-3 text-sm text-black/70",
            navLink:
                "rounded-lg px-3 py-1.5 hover:bg-black/[0.03] transition",
            main: "mt-10 space-y-16",
            kpiGrid: "mt-8 grid gap-3",
            kpi:
                "rounded-2xl border border-black/10 bg-white/70 p-5 shadow-sm",
            kpiLabel: "text-xs uppercase tracking-[0.18em] text-black/50",
            kpiValue: "mt-2 text-2xl font-semibold text-black",
            kpiHint: "mt-1 text-xs text-black/55",
            card:
                "rounded-2xl border border-black/10 bg-white/70 p-6 shadow-sm hover:shadow-md transition",
            body: "text-sm text-black/70",
            time: "text-xs text-black/55",
            skill:
                "rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-xs text-black/75 hover:bg-black/[0.06] transition",
            footer:
                "mt-16 rounded-3xl border border-black/10 bg-white/70 backdrop-blur-xl p-8 md:p-10 shadow-sm",
            footerTitle: "text-2xl md:text-3xl font-semibold tracking-tight",
            footerText: "mt-2 text-sm md:text-base text-black/65",
        }
        : {
            page: "min-h-screen bg-[#07070B] text-white",
            shell: "mx-auto max-w-7xl px-6 py-12",
            heroWrap:
                "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)]",
            heroInner: "px-6 py-12 md:px-10 md:py-16",
            glow:
                "pointer-events-none absolute -top-24 -right-28 h-[380px] w-[380px] rounded-full bg-violet-500/20 blur-3xl",
            glow2:
                "pointer-events-none absolute -bottom-24 -left-20 h-[340px] w-[340px] rounded-full bg-fuchsia-500/15 blur-3xl",
            name: "text-4xl md:text-6xl font-semibold tracking-tight",
            headline: "mt-4 text-lg md:text-xl text-white/75",
            summary: "mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-white/70",
            quick: "mt-7 flex flex-wrap gap-2",
            chipsRow: "mt-4 flex flex-wrap gap-2",
            actions: "mt-8 flex flex-wrap gap-3",
            nav:
                "sticky top-4 z-10 mt-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur px-4 py-3",
            navText: "flex flex-wrap gap-3 text-sm text-white/70",
            navLink:
                "rounded-lg px-3 py-1.5 hover:bg-white/10 transition",
            main: "mt-10 space-y-16",
            kpiGrid: "mt-8 grid gap-3",
            kpi:
                "rounded-2xl border border-white/10 bg-black/40 p-5",
            kpiLabel: "text-xs uppercase tracking-[0.18em] text-white/45",
            kpiValue: "mt-2 text-2xl font-semibold text-white",
            kpiHint: "mt-1 text-xs text-white/55",
            card:
                "rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition",
            body: "text-sm text-white/70",
            time: "text-xs text-white/55",
            skill:
                "rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/75 hover:bg-white/10 transition",
            footer:
                "mt-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10",
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

    const primaryCta = p.email
        ? { label: "Contact", href: `mailto:${p.email}` }
        : links[0] || null;

    const secondaryCta = p.website
        ? { label: "View Work", href: "#projects" }
        : { label: "View Work", href: "#projects" };

    const nav = [
        { id: "projects", label: "Featured", show: d.projects.length > 0 },
        { id: "experience", label: "Experience", show: d.experience.length > 0 },
        { id: "skills", label: "Skills", show: d.skills.length > 0 },
        { id: "education", label: "Education", show: d.education.length > 0 },
    ].filter((x) => x.show);

    const topProjects = d.projects.slice(0, 6);

    const kpis = useMemo(() => {
        const projectCount = d.projects.length;
        const expCount = d.experience.length;
        const skillCount = d.skills.length;

        const safe = (n: number) => (Number.isFinite(n) ? n : 0);

        return [
            {
                label: "Projects",
                value: String(safe(projectCount)),
                hint: projectCount ? "shipped things" : "add projects",
            },
            {
                label: "Experience",
                value: String(safe(expCount)),
                hint: expCount ? "roles & impact" : "add experience",
            },
            {
                label: "Skills",
                value: String(safe(skillCount)),
                hint: skillCount ? "tools & stack" : "add skills",
            },
        ];
    }, [d.projects.length, d.experience.length, d.skills.length]);

    return (
        <div className={ui.page}>
            <div className={ui.shell}>
                {/* HERO */}
                <div className={ui.heroWrap}>
                    <div className={ui.glow} />
                    <div className={ui.glow2} />

                    <div className={ui.heroInner}>
                        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                                <h1 className={ui.name}>{p.fullName || "Your Name"}</h1>

                                <p className={ui.headline}>
                                    {p.headline || "Add a bold headline that instantly says what you do."}
                                </p>

                                <p className={ui.summary}>
                                    {p.summary ||
                                        "Keep it short. What do you build, who do you help, and what kind of problems you love solving."}
                                </p>

                                <div className={ui.quick}>
                                    {p.location ? <Chip isLight={isLight}>{p.location}</Chip> : null}
                                </div>

                                <div className={ui.actions}>
                                    <PrimaryButton
                                        isLight={isLight}
                                        href={secondaryCta.href}
                                        label={secondaryCta.label}
                                    />
                                    {primaryCta ? (
                                        <SecondaryButton
                                            isLight={isLight}
                                            href={primaryCta.href}
                                            label={primaryCta.label}
                                        />
                                    ) : null}
                                    {links.slice(0, 2).map((l) => (
                                        <SecondaryButton
                                            key={l.href}
                                            isLight={isLight}
                                            href={l.href}
                                            label={l.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="w-full md:w-110">
                                <div className={ui.kpiGrid}>
                                    {kpis.map((k) => (
                                        <div key={k.label} className={ui.kpi}>
                                            <div className={ui.kpiLabel}>{k.label}</div>
                                            <div className={ui.kpiValue}>{k.value}</div>
                                            <div className={ui.kpiHint}>{k.hint}</div>
                                        </div>
                                    ))}
                                </div>

                                {links.length ? (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {links.map((l) => (
                                            <Chip key={l.href} isLight={isLight}>
                                                {l.label}
                                            </Chip>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {nav.length ? (
                            <div className={ui.nav}>
                                <div className={ui.navText}>
                                    {nav.map((n) => (
                                        <a key={n.id} href={`#${n.id}`} className={ui.navLink}>
                                            {n.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className={ui.main}>
                    {/* PROJECTS */}
                    {topProjects.length ? (
                        <Section
                            id="projects"
                            title="Featured Work"
                            subtitle="Hand-picked projects that show range, depth, and impact."
                            isLight={isLight}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                {topProjects.map((pr, i) => (
                                    <ProjectCard
                                        key={`${pr.name}-${i}`}
                                        title={pr.name || "Untitled project"}
                                        desc={pr.description || undefined}
                                        highlights={pr.highlights || undefined}
                                        tech={pr.tech || undefined}
                                        link={pr.link || null}
                                        isLight={isLight}
                                    />
                                ))}
                            </div>
                        </Section>
                    ) : null}

                    {/* EXPERIENCE */}
                    {d.experience.length ? (
                        <Section
                            id="experience"
                            title="Experience"
                            subtitle="The roles where I shipped, led, improved, and learned."
                            isLight={isLight}
                        >
                            <div className="grid gap-4">
                                {d.experience.map((ex, i) => (
                                    <div key={`${ex.company}-${ex.role}-${i}`} className={ui.card}>
                                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                                            <div className="text-base font-semibold tracking-tight">
                                                {ex.role || "Role"}
                                            </div>
                                            <div className={ui.time}>
                                                {ex.start}
                                                {ex.end ? ` — ${ex.end}` : ""}
                                            </div>
                                        </div>

                                        <div className={["mt-1", ui.body].join(" ")}>
                                            {ex.company || "Company"}
                                            {ex.location ? ` • ${ex.location}` : ""}
                                        </div>

                                        {ex.highlights.length ? (
                                            <ul className={["mt-4 space-y-2", ui.body].join(" ")}>
                                                {ex.highlights.slice(0, 6).map((h, idx) => (
                                                    <li key={idx} className="flex gap-2">
                                                        <span className={isLight ? "text-violet-700/70" : "text-violet-300/70"}>
                                                            •
                                                        </span>
                                                        <span>{h}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    ) : null}

                    {/* SKILLS */}
                    {d.skills.length ? (
                        <Section
                            id="skills"
                            title="Skills"
                            subtitle="Tools I use to ship fast, clean, and reliably."
                            isLight={isLight}
                        >
                            <div className="flex flex-wrap gap-2">
                                {d.skills.slice(0, 72).map((s) => (
                                    <span key={s} className={ui.skill}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </Section>
                    ) : null}

                    {/* EDUCATION */}
                    {d.education.length ? (
                        <Section
                            id="education"
                            title="Education"
                            subtitle="Foundations and formal learning."
                            isLight={isLight}
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                {d.education.map((ed, i) => (
                                    <div key={`${ed.school}-${i}`} className={ui.card}>
                                        <div className="text-base font-semibold tracking-tight">
                                            {ed.school || "School"}
                                        </div>
                                        <div className={["mt-1", ui.body].join(" ")}>
                                            {ed.degree || "Degree"}
                                        </div>
                                        <div className={ui.time}>
                                            {ed.start}
                                            {ed.end ? ` — ${ed.end}` : ""}
                                        </div>
                                        {ed.notes ? (
                                            <div className={["mt-4", ui.body].join(" ")}>{ed.notes}</div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    ) : null}

                    {/* CTA FOOTER */}
                    <div className={ui.footer}>
                        <div className={ui.footerTitle}>Let’s build something great.</div>
                        <div className={ui.footerText}>
                            If you want to collaborate, hire, or just say hi, reach out.
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                            {p.email ? (
                                <PrimaryButton
                                    isLight={isLight}
                                    href={`mailto:${p.email}`}
                                    label="Email Me"
                                />
                            ) : null}
                            {p.linkedin ? (
                                <SecondaryButton
                                    isLight={isLight}
                                    href={p.linkedin}
                                    label="LinkedIn"
                                />
                            ) : null}
                            {p.github ? (
                                <SecondaryButton isLight={isLight} href={p.github} label="GitHub" />
                            ) : null}
                            {p.website ? (
                                <SecondaryButton isLight={isLight} href={p.website} label="Website" />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return <TemplateSpotlight draft={defaultDraft} />;
}
