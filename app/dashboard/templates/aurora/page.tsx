import type { PortfolioDraft } from "@/lib/draft";
import { normalizeDraft } from "@/lib/normalizeDraft";
import { defaultDraft } from "@/lib/draft";

function ExternalLink({
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
        ? "group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-sm text-black/80 hover:bg-white hover:border-black/20 transition shadow-sm"
        : "group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 hover:border-white/20 transition";

    const dotCls = isLight
        ? "h-1.5 w-1.5 rounded-full bg-black/35 group-hover:bg-black/60 transition"
        : "h-1.5 w-1.5 rounded-full bg-white/40 group-hover:bg-white/70 transition";

    return (
        <a
            href={href}
            target={isMail || isTel ? undefined : "_blank"}
            rel={isMail || isTel ? undefined : "noreferrer"}
            className={cls}
        >
            <span className={dotCls} />
            {label}
        </a>
    );
}

function Section({
    id,
    title,
    children,
    subtitle,
    isLight,
}: {
    id: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    isLight: boolean;
}) {
    const titleCls = isLight
        ? "text-sm font-semibold tracking-[0.22em] uppercase text-black/60"
        : "text-sm font-semibold tracking-[0.22em] uppercase text-white/60";

    const subCls = isLight ? "mt-1 text-xs text-black/45" : "mt-1 text-xs text-white/45";

    const divider = isLight
        ? "hidden md:block h-px flex-1 bg-linear-to-r from-black/20 via-black/5 to-transparent"
        : "hidden md:block h-px flex-1 bg-linear-to-r from-white/20 via-white/5 to-transparent";

    return (
        <section id={id} className="scroll-mt-24">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h2 className={titleCls}>{title}</h2>
                    {subtitle ? <p className={subCls}>{subtitle}</p> : null}
                </div>
                <div className={divider} />
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}

function AuroraBackground({ isLight }: { isLight: boolean }) {
    if (isLight) {
        return (
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 left-1/2 h-95 w-195 -translate-x-1/2 rounded-full bg-linear-to-r from-fuchsia-500/18 via-cyan-400/14 to-emerald-400/14 blur-3xl" />
                <div className="absolute top-1/3 -left-24 h-105 w-130 rounded-full bg-linear-to-br from-cyan-400/14 via-indigo-500/12 to-fuchsia-500/14 blur-3xl" />
                <div className="absolute -bottom-28 right-0 h-105 w-180 rounded-full bg-linear-to-tr from-emerald-400/14 via-cyan-400/10 to-indigo-500/14 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.04),transparent_60%)]" />
                <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-size-[56px_56px]" />
                <div className="absolute inset-0 bg-white/85" />
            </div>
        );
    }

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 left-1/2 h-95 w-195 -translate-x-1/2 rounded-full bg-linear-to-r from-fuchsia-500/25 via-cyan-400/20 to-emerald-400/20 blur-3xl" />
            <div className="absolute top-1/3 -left-24 h-105 w-130 rounded-full bg-linear-to-br from-cyan-400/18 via-indigo-500/16 to-fuchsia-500/18 blur-3xl" />
            <div className="absolute -bottom-28 right-0 h-105 w-180 rounded-full bg-linear-to-tr from-emerald-400/18 via-cyan-400/14 to-indigo-500/18 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
            <div className="absolute inset-0 opacity-[0.22] bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[48px_48px]" />
            <div className="absolute inset-0 bg-black/65" />
        </div>
    );
}

export function TemplateAurora({ draft }: { draft: PortfolioDraft }) {
    const d = normalizeDraft(draft);
    const p = d.profile;

    const isLight = d.theme === "light";

    const ui = isLight
        ? {
            page: "min-h-screen text-black bg-white relative",
            hero: "rounded-3xl border border-black/10 bg-white/65 backdrop-blur-xl p-7 md:p-10 shadow-[0_0_0_1px_rgba(0,0,0,0.03)]",
            badge: "inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/70 shadow-sm",
            badgeDot: "h-1.5 w-1.5 rounded-full bg-emerald-600/70",
            heroHeadline: "mt-3 text-lg md:text-xl text-black/75",
            meta: "mt-4 flex flex-wrap items-center gap-3 text-sm text-black/55",
            metaDot: "h-1 w-1 rounded-full bg-black/25",
            metaSep: "hidden sm:inline text-black/25",
            summary: "text-base leading-relaxed text-black/70",
            navPill:
                "rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-sm text-black/70 hover:text-black hover:border-black/20 hover:bg-white transition shadow-sm",
            card:
                "group rounded-3xl border border-black/10 bg-white/65 backdrop-blur-xl p-6 hover:border-black/20 transition shadow-[0_0_0_1px_rgba(0,0,0,0.03)]",
            link: "text-sm text-black/60 hover:text-black transition",
            highlightDot: "mr-2 inline-block h-1.5 w-1.5 rounded-full bg-black/25 group-hover:bg-black/55 transition",
            chip: "rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs text-black/70 shadow-sm",
            expCard:
                "rounded-3xl border border-black/10 bg-white/65 backdrop-blur-xl p-6 hover:border-black/20 transition",
            skillChip:
                "rounded-full border border-black/10 bg-white/65 px-3 py-1 text-xs text-black/70 hover:bg-white hover:border-black/20 transition shadow-sm",
            eduCard:
                "rounded-3xl border border-black/10 bg-white/65 backdrop-blur-xl p-6 hover:border-black/20 transition",
            time: "text-xs text-black/55",
            bodyMuted: "text-sm text-black/70",
        }
        : {
            page: "min-h-screen text-white bg-black relative",
            hero: "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 md:p-10 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
            badge: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70",
            badgeDot: "h-1.5 w-1.5 rounded-full bg-emerald-400/70",
            heroHeadline: "mt-3 text-lg md:text-xl text-white/75",
            meta: "mt-4 flex flex-wrap items-center gap-3 text-sm text-white/55",
            metaDot: "h-1 w-1 rounded-full bg-white/30",
            metaSep: "hidden sm:inline text-white/25",
            summary: "text-base leading-relaxed text-white/70",
            navPill:
                "rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-white/70 hover:text-white hover:border-white/25 hover:bg-white/10 transition",
            card:
                "group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-white/20 transition shadow-[0_0_0_1px_rgba(255,255,255,0.05)]",
            link: "text-sm text-white/60 hover:text-white transition",
            highlightDot: "mr-2 inline-block h-1.5 w-1.5 rounded-full bg-white/35 group-hover:bg-white/60 transition",
            chip: "rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-white/70",
            expCard:
                "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-white/20 transition",
            skillChip:
                "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 hover:border-white/25 transition",
            eduCard:
                "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-white/20 transition",
            time: "text-xs text-white/60",
            bodyMuted: "text-sm text-white/70",
        };

    const links = [
        p.website ? { label: "Website", href: p.website } : null,
        p.github ? { label: "GitHub", href: p.github } : null,
        p.linkedin ? { label: "LinkedIn", href: p.linkedin } : null,
        p.email ? { label: "Email", href: `mailto:${p.email}` } : null,
        p.phone ? { label: "Call", href: `tel:${p.phone.replace(/\s+/g, "")}` } : null,
    ].filter(Boolean) as Array<{ label: string; href: string }>;

    const nav = [
        { id: "projects", label: "Projects", show: d.projects.length > 0 },
        { id: "experience", label: "Experience", show: d.experience.length > 0 },
        { id: "skills", label: "Skills", show: d.skills.length > 0 },
        { id: "education", label: "Education", show: d.education.length > 0 },
    ].filter((x) => x.show);

    return (
        <div className={ui.page}>
            <AuroraBackground isLight={isLight} />

            <div className="relative mx-auto max-w-7xl px-6 py-12">
                {/* Hero */}
                <div className={ui.hero}>
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                            <div className={ui.badge}>
                                <span className={ui.badgeDot} />
                                Available for opportunities
                            </div>

                            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
                                {p.fullName || "Your Name"}
                            </h1>

                            {p.headline ? (
                                <p className={ui.heroHeadline}>{p.headline}</p>
                            ) : (
                                <p className={ui.heroHeadline}>
                                    Add your headline to make the first impression strong.
                                </p>
                            )}

                            <div className={ui.meta}>
                                {p.location ? (
                                    <span className="inline-flex items-center gap-2">
                                        <span className={ui.metaDot} />
                                        {p.location}
                                    </span>
                                ) : null}
                                <span className={ui.metaSep}>•</span>
                                {/* <span>Single-page portfolio</span> */}
                            </div>
                        </div>

                        {links.length ? (
                            <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                                {links.map((l) => (
                                    <ExternalLink key={l.href} href={l.href} label={l.label} isLight={isLight} />
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-6">
                        <p className={ui.summary}>
                            {p.summary || "Add a short summary to introduce yourself."}
                        </p>
                    </div>

                    {nav.length ? (
                        <div className="mt-8">
                            <div className="flex flex-wrap gap-2">
                                {nav.map((n) => (
                                    <a key={n.id} href={`#${n.id}`} className={ui.navPill}>
                                        {n.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="mt-12 space-y-16">
                    {/* Projects */}
                    {d.projects.length ? (
                        <Section
                            id="projects"
                            title="Projects"
                            subtitle="Selected work and outcomes"
                            isLight={isLight}
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                {d.projects.map((pr, i) => (
                                    <article key={`${pr.name}-${i}`} className={ui.card}>
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-lg font-medium">{pr.name || "Untitled project"}</h3>
                                            {pr.link ? (
                                                <a
                                                    href={pr.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={ui.link}
                                                    aria-label="Open project link"
                                                >
                                                    ↗
                                                </a>
                                            ) : null}
                                        </div>

                                        {pr.description ? (
                                            <p className={["mt-2", ui.bodyMuted].join(" ")}>
                                                {pr.description}
                                            </p>
                                        ) : null}

                                        {pr.highlights.length ? (
                                            <ul className="mt-4 space-y-2">
                                                {pr.highlights.slice(0, 4).map((h, idx) => (
                                                    <li key={idx} className={ui.bodyMuted}>
                                                        <span className={ui.highlightDot} />
                                                        {h}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : null}

                                        {pr.tech.length ? (
                                            <div className="mt-5 flex flex-wrap gap-2">
                                                {pr.tech.slice(0, 10).map((t) => (
                                                    <span key={t} className={ui.chip}>
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : null}
                                    </article>
                                ))}
                            </div>
                        </Section>
                    ) : null}

                    {/* Experience */}
                    {d.experience.length ? (
                        <Section
                            id="experience"
                            title="Experience"
                            subtitle="Roles, impact, and key contributions"
                            isLight={isLight}
                        >
                            <div className="space-y-5">
                                {d.experience.map((ex, i) => (
                                    <div key={`${ex.company}-${ex.role}-${i}`} className={ui.expCard}>
                                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                                            <div className="text-lg font-medium">{ex.role || "Role"}</div>
                                            <div className={ui.time}>
                                                {ex.start}
                                                {ex.end ? ` — ${ex.end}` : ""}
                                            </div>
                                        </div>
                                        <div className={["mt-1", ui.bodyMuted].join(" ")}>
                                            {ex.company || "Company"}
                                            {ex.location ? ` • ${ex.location}` : ""}
                                        </div>

                                        {ex.highlights.length ? (
                                            <ul className={["mt-4 list-disc pl-5 space-y-1.5", ui.bodyMuted].join(" ")}>
                                                {ex.highlights.slice(0, 6).map((h, idx) => (
                                                    <li key={idx}>{h}</li>
                                                ))}
                                            </ul>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    ) : null}

                    {/* Skills */}
                    {d.skills.length ? (
                        <Section id="skills" title="Skills" subtitle="Tools and strengths" isLight={isLight}>
                            <div className="flex flex-wrap gap-2">
                                {d.skills.slice(0, 60).map((s) => (
                                    <span key={s} className={ui.skillChip}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </Section>
                    ) : null}

                    {/* Education */}
                    {d.education.length ? (
                        <Section id="education" title="Education" subtitle="Academic background" isLight={isLight}>
                            <div className="grid gap-5 md:grid-cols-2">
                                {d.education.map((ed, i) => (
                                    <div key={`${ed.school}-${i}`} className={ui.eduCard}>
                                        <div className="text-lg font-medium">{ed.school || "School"}</div>
                                        <div className={["mt-1", ui.bodyMuted].join(" ")}>
                                            {ed.degree || "Degree"}
                                        </div>
                                        <div className={ui.time}>
                                            {ed.start}
                                            {ed.end ? ` — ${ed.end}` : ""}
                                        </div>
                                        {ed.notes ? (
                                            <div className={["mt-3", ui.bodyMuted].join(" ")}>
                                                {ed.notes}
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </Section>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return <TemplateAurora draft={defaultDraft} />;
}
