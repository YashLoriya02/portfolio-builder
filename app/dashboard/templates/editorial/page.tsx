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
        ? "inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-sm text-black/80 hover:bg-black/[0.06] transition"
        : "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 transition";

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
    children,
    isLight,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
    isLight: boolean;
}) {
    const titleCls = isLight
        ? "text-base font-semibold tracking-[0.26em] uppercase text-black/55"
        : "text-base font-semibold tracking-[0.26em] uppercase text-white/55";

    const lineCls = isLight ? "bg-black/10" : "bg-white/10";

    return (
        <section id={id} className="scroll-mt-24">
            <div className="flex items-center justify-between gap-4">
                <h2 className={titleCls}>{title}</h2>
                <div className={`h-px flex-1 ${lineCls}`} />
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}

export function TemplateEditorial({ draft }: { draft: PortfolioDraft }) {
    const d = normalizeDraft(draft);
    const p = d.profile;

    const isLight = d.theme === "light";

    const ui = isLight
        ? {
            page: "min-h-screen bg-white text-black",
            badgeWrap: "inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-black/70",
            badgeDot: "h-1.5 w-1.5 rounded-full bg-black/60",
            headline: "mt-3 text-lg text-black/75",
            location: "mt-3 text-sm text-black/55",
            summary: "mt-6 max-w-full text-base leading-relaxed text-black/70",
            navBox: "rounded-2xl border border-black/10 bg-black/[0.03] p-5",
            navTitle: "text-xs font-semibold tracking-[0.22em] uppercase text-black/50",
            navLink: "block rounded-lg px-3 py-2 text-black/70 hover:bg-black/[0.06] hover:text-black transition",
            navEmpty: "rounded-2xl border border-black/10 bg-black/[0.03] p-5 text-sm text-black/60",
            card: "rounded-2xl border border-black/10 bg-black/[0.03] p-6 hover:bg-black/[0.05] transition",
            cardTitle: "text-lg font-medium",
            smallMuted: "text-xs text-black/50",
            bodyMuted: "text-sm text-black/70",
            link: "text-sm text-black/60 hover:text-black",
            techChip: "rounded-full border border-black/10 bg-black/[0.04] px-2.5 py-1 text-xs text-black/70",
            skillChip: "rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-black/70 hover:bg-black/[0.06] transition",
        }
        : {
            page: "min-h-screen bg-[#0b0c0f] text-white",
            badgeWrap: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70",
            badgeDot: "h-1.5 w-1.5 rounded-full bg-white/60",
            headline: "mt-3 text-lg text-white/75",
            location: "mt-3 text-sm text-white/50",
            summary: "mt-6 max-w-full text-base leading-relaxed text-white/70",
            navBox: "rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5",
            navTitle: "text-xs font-semibold tracking-[0.22em] uppercase text-white/50",
            navLink: "block rounded-lg px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white transition",
            navEmpty: "rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60",
            card: "rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition",
            cardTitle: "text-lg font-medium",
            smallMuted: "text-xs text-white/50",
            bodyMuted: "text-sm text-white/70",
            link: "text-sm text-white/60 hover:text-white",
            techChip: "rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-white/70",
            skillChip: "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10 transition",
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
            <div className="mx-auto max-w-7xl px-6 py-12">
                {/* Header */}
                <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <div className={ui.badgeWrap}>
                            <span className={ui.badgeDot} />
                            Portfolio
                        </div>

                        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
                            {p.fullName || "Your Name"}
                        </h1>

                        {p.headline ? (
                            <p className={ui.headline}>{p.headline}</p>
                        ) : (
                            <p className={ui.headline}>
                                Add a headline that quickly explains what you do.
                            </p>
                        )}

                        {p.location ? <p className={ui.location}>{p.location}</p> : null}

                        <p className={ui.summary}>
                            {p.summary || "Add a short summary to introduce yourself."}
                        </p>

                        {links.length ? (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {links.map((l) => (
                                    <ExternalLink key={l.href} href={l.href} label={l.label} isLight={isLight} />
                                ))}
                            </div>
                        ) : null}
                    </div>

                    {/* Sidebar nav */}
                    <div className="md:pt-14">
                        {nav.length ? (
                            <div className="sticky top-6">
                                <div className={ui.navBox}>
                                    <div className={ui.navTitle}>Contents</div>
                                    <div className="mt-4 space-y-1 text-sm">
                                        {nav.map((n) => (
                                            <a key={n.id} href={`#${n.id}`} className={ui.navLink}>
                                                {n.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={ui.navEmpty}>
                                Add some sections (projects, experience, skills) to see navigation here.
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 space-y-16">
                    {d.projects.length ? (
                        <Section id="projects" title="Projects" isLight={isLight}>
                            <div className="grid gap-5 md:grid-cols-2">
                                {d.projects.map((pr, i) => (
                                    <article key={`${pr.name}-${i}`} className={ui.card}>
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className={ui.cardTitle}>{pr.name || "Untitled project"}</h3>
                                            {pr.link ? (
                                                <a href={pr.link} target="_blank" rel="noreferrer" className={ui.link}>
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
                                            <ul className={["mt-4 list-disc pl-5 space-y-1.5", ui.bodyMuted].join(" ")}>
                                                {pr.highlights.slice(0, 4).map((h, idx) => (
                                                    <li key={idx}>{h}</li>
                                                ))}
                                            </ul>
                                        ) : null}

                                        {pr.tech.length ? (
                                            <div className="mt-5 flex flex-wrap gap-2">
                                                {pr.tech.slice(0, 10).map((t) => (
                                                    <span key={t} className={ui.techChip}>
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

                    {d.experience.length ? (
                        <div className="mt-5">
                            <Section id="experience" title="Experience" isLight={isLight}>
                                <div className="space-y-5 flex flex-col gap-4">
                                    {d.experience.map((ex, i) => (
                                        <div key={`${ex.company}-${ex.role}-${i}`} className={ui.card}>
                                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                <div className="text-lg font-medium">{ex.role || "Role"}</div>
                                                <div className={ui.smallMuted}>
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
                        </div>
                    ) : null}

                    {d.skills.length ? (
                        <div className="mt-5">
                            <Section id="skills" title="Skills" isLight={isLight}>
                                <div className="flex flex-wrap gap-2">
                                    {d.skills.slice(0, 60).map((s) => (
                                        <span key={s} className={ui.skillChip}>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </Section>
                        </div>
                    ) : null}

                    {d.education.length ? (
                        <div className="mt-5">
                            <Section id="education" title="Education" isLight={isLight}>
                                <div className="grid gap-5 md:grid-cols-2">
                                    {d.education.map((ed, i) => (
                                        <div key={`${ed.school}-${i}`} className={ui.card}>
                                            <div className="text-lg font-medium">{ed.school || "School"}</div>
                                            <div className={["mt-1", ui.bodyMuted].join(" ")}>
                                                {ed.degree || "Degree"}
                                            </div>
                                            <div className={ui.smallMuted}>
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
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return <TemplateEditorial draft={defaultDraft} />;
}
