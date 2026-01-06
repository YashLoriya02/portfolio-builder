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
        ? "rounded-full border border-pink-600/15 bg-pink-600/10 px-3 py-1 text-xs text-pink-900/80"
        : "rounded-full border border-pink-300/15 bg-pink-300/10 px-3 py-1 text-xs text-pink-200/90";
    return <span className={cls}>{children}</span>;
}

function Button({
    href,
    label,
    variant,
    isLight,
}: {
    href: string;
    label: string;
    variant: "primary" | "secondary";
    isLight: boolean;
}) {
    const isMail = href.startsWith("mailto:");
    const isTel = href.startsWith("tel:");

    const cls =
        variant === "primary"
            ? isLight
                ? "inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-black/90 transition"
                : "inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black shadow-sm hover:bg-white/90 transition"
            : isLight
                ? "inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm text-black/80 hover:bg-black/[0.03] transition shadow-sm"
                : "inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 hover:bg-white/10 transition";

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
    const t = isLight
        ? "text-sm font-semibold tracking-[0.18em] uppercase text-black/70"
        : "text-sm font-semibold tracking-[0.18em] uppercase text-white/70";
    const s = isLight ? "mt-2 text-sm text-black/55" : "mt-2 text-sm text-white/55";
    const line = isLight ? "bg-black/10" : "bg-white/10";

    return (
        <section id={id} className="scroll-mt-24">
            <div className="flex items-center gap-4">
                <div className={t}>{title}</div>
                <div className={`h-px flex-1 ${line}`} />
            </div>
            {subtitle ? <p className={s}>{subtitle}</p> : null}
            <div className="mt-6">{children}</div>
        </section>
    );
}

function ProjectTile({
    title,
    desc,
    tags,
    href,
    isLight,
}: {
    title: string;
    desc?: string;
    tags?: string[];
    href?: string | null;
    isLight: boolean;
}) {
    const tile = isLight
        ? "group rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm hover:shadow-md transition"
        : "group rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition";

    const h3 = isLight
        ? "text-base font-semibold tracking-tight text-black"
        : "text-base font-semibold tracking-tight text-white";

    const body = isLight ? "mt-2 text-sm text-black/70" : "mt-2 text-sm text-white/70";

    const badge = isLight
        ? "rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-black/75"
        : "rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/75";

    const corner = isLight
        ? "text-black/55 group-hover:text-black/80 transition"
        : "text-white/60 group-hover:text-white/85 transition";

    const cover = isLight
        ? "relative mb-5 overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-br from-pink-500/10 via-fuchsia-500/10 to-amber-500/10"
        : "relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/20 via-white/10 to-amber-500/15";

    return (
        <article className={tile}>
            <div className={cover}>
                <div className="absolute inset-0 opacity-80" />
                <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div className={h3}>{title}</div>
                        {href ? (
                            <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl border px-3 py-2 text-sm"
                                style={{
                                    borderColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.12)",
                                    background: isLight ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.25)",
                                }}
                                aria-label="Open"
                                title="Open"
                            >
                                <span className={corner}>↗</span>
                            </a>
                        ) : null}
                    </div>

                    {desc ? <div className={body}>{desc}</div> : null}

                    {tags && tags.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {tags.slice(0, 8).map((t) => (
                                <span key={t} className={badge}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className={isLight ? "text-xs text-black/55" : "text-xs text-white/55"}>
                    Case study
                </div>
                <div className={isLight ? "text-xs text-pink-700/70" : "text-xs text-pink-300/70"}>
                    Muse
                </div>
            </div>
        </article>
    );
}

export function TemplateMuse({ draft }: { draft: PortfolioDraft }) {
    const d = normalizeDraft(draft);
    const p = d.profile;
    const isLight = d.theme === "light";

    const ui = isLight
        ? {
            page: "min-h-screen bg-[#fbfbfd] text-black",
            shell: "mx-auto max-w-7xl px-6 py-12",
            hero:
                "relative overflow-hidden rounded-[2.25rem] border border-black/10 bg-white/70 backdrop-blur-xl shadow-[0_0_0_1px_rgba(0,0,0,0.03)]",
            heroInner: "px-6 py-12 md:px-10 md:py-16",
            glow1:
                "pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-pink-500/14 blur-3xl",
            glow2:
                "pointer-events-none absolute -bottom-28 -right-24 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-3xl",
            name: "text-4xl md:text-6xl font-semibold tracking-tight",
            headline: "mt-4 text-lg md:text-xl text-black/70",
            summary: "mt-6 max-w-3xl text-sm md:text-base leading-relaxed text-black/65",
            actions: "mt-8 flex flex-wrap gap-3",
            metaRow: "mt-6 flex flex-wrap gap-2",
            main: "mt-10 grid gap-6 lg:grid-cols-[1fr_360px]",
            sidebar:
                "rounded-3xl border border-black/10 bg-white/70 backdrop-blur p-6 shadow-sm lg:sticky lg:top-6 h-fit",
            sideTitle: "text-sm font-semibold tracking-[0.18em] uppercase text-black/70",
            sideText: "mt-3 text-sm text-black/65 leading-relaxed",
            sideList: "mt-5 flex flex-wrap gap-2",
            divider: "my-6 h-px bg-black/10",
            label: "text-xs uppercase tracking-[0.18em] text-black/55",
            val: "mt-1 text-sm text-black/70",
            grid: "grid gap-4 md:grid-cols-2",
            footer:
                "mt-10 rounded-[2.25rem] border border-black/10 bg-white/70 backdrop-blur p-8 md:p-10 shadow-sm",
            footerTitle: "text-2xl md:text-3xl font-semibold tracking-tight",
            footerText: "mt-2 text-sm md:text-base text-black/65",
        }
        : {
            page: "min-h-screen bg-[#07070B] text-white",
            shell: "mx-auto max-w-7xl px-6 py-12",
            hero:
                "relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)]",
            heroInner: "px-6 py-12 md:px-10 md:py-16",
            glow1:
                "pointer-events-none absolute -top-24 -left-24 h-[300px] w-[300px] rounded-full bg-pink-500/15 blur-3xl",
            glow2:
                "pointer-events-none absolute -bottom-28 -right-24 h-[300px] w-[300px] rounded-full bg-amber-500/15 blur-3xl",
            name: "text-4xl md:text-6xl font-semibold tracking-tight",
            headline: "mt-4 text-lg md:text-xl text-white/75",
            summary: "mt-6 max-w-3xl text-sm md:text-base leading-relaxed text-white/70",
            actions: "mt-8 flex flex-wrap gap-3",
            metaRow: "mt-6 flex flex-wrap gap-2",
            main: "mt-10 grid gap-6 lg:grid-cols-[1fr_360px]",
            sidebar:
                "rounded-3xl border border-white/10 bg-black/40 backdrop-blur p-6 lg:sticky lg:top-6 h-fit",
            sideTitle: "text-sm font-semibold tracking-[0.18em] uppercase text-white/70",
            sideText: "mt-3 text-sm text-white/70 leading-relaxed",
            sideList: "mt-5 flex flex-wrap gap-2",
            divider: "my-6 h-px bg-white/10",
            label: "text-xs uppercase tracking-[0.18em] text-white/50",
            val: "mt-1 text-sm text-white/70",
            grid: "grid gap-4 md:grid-cols-2",
            footer:
                "mt-10 rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur p-8 md:p-10",
            footerTitle: "text-2xl md:text-3xl font-semibold tracking-tight",
            footerText: "mt-2 text-sm md:text-base text-white/70",
        };

    const links = [
        p.website ? { label: "Website", href: p.website } : null,
        p.github ? { label: "GitHub", href: p.github } : null,
        p.linkedin ? { label: "LinkedIn", href: p.linkedin } : null,
        p.email ? { label: "Email", href: `mailto:${p.email}` } : null,
    ].filter(Boolean) as Array<{ label: string; href: string }>;

    const featured = d.projects.slice(0, 6);

    const museQuote =
        p.summary ||
        "Design is the moment when intention becomes something real. I care about craft, clarity, and outcomes.";

    return (
        <div className={ui.page}>
            <div className={ui.shell}>
                {/* Hero */}
                <div className={ui.hero}>
                    <div className={ui.glow1} />
                    <div className={ui.glow2} />
                    <div className={ui.heroInner}>
                        <h1 className={ui.name}>{p.fullName || "Your Name"}</h1>
                        <p className={ui.headline}>
                            {p.headline || "A creative, aesthetic template for showcasing craft and taste."}
                        </p>

                        <div className={ui.metaRow}>
                            {p.location ? <Chip isLight={isLight}>{p.location}</Chip> : null}
                            {d.projects.length ? <Chip isLight={isLight}>{d.projects.length} projects</Chip> : null}
                            {d.skills.length ? <Chip isLight={isLight}>{d.skills.length} skills</Chip> : null}
                        </div>

                        <p className={ui.summary}>
                            {p.summary ||
                                "Muse is for people who care about craft. It turns your portfolio into a small magazine: bold sections, beautiful cards, and strong storytelling."}
                        </p>

                        <div className={ui.actions}>
                            <Button href="#work" label="View Work" variant="primary" isLight={isLight} />
                            {p.email ? (
                                <Button
                                    href={`mailto:${p.email}`}
                                    label="Contact"
                                    variant="secondary"
                                    isLight={isLight}
                                />
                            ) : null}
                            {links.slice(0, 2).map((l) => (
                                <Button
                                    key={l.href}
                                    href={l.href}
                                    label={l.label}
                                    variant="secondary"
                                    isLight={isLight}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className={ui.main}>
                    <main>
                        <Section
                            id="work"
                            title="Selected Work"
                            subtitle="A curated set of projects that represent range and taste."
                            isLight={isLight}
                        >
                            {featured.length ? (
                                <div className={ui.grid}>
                                    {featured.map((pr, i) => (
                                        <ProjectTile
                                            key={`${pr.name}-${i}`}
                                            title={pr.name || "Untitled project"}
                                            desc={pr.description || undefined}
                                            tags={pr.tech || undefined}
                                            href={pr.link || null}
                                            isLight={isLight}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div
                                    className={
                                        isLight
                                            ? "rounded-3xl border border-black/10 bg-white/70 p-8 text-sm text-black/65"
                                            : "rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-white/70"
                                    }
                                >
                                    Add projects to make Muse shine.
                                </div>
                            )}
                        </Section>

                        {d.experience.length ? (
                            <div className="mt-16">
                                <Section
                                    id="experience"
                                    title="Experience"
                                    subtitle="Where I contributed and what I shipped."
                                    isLight={isLight}
                                >
                                    <div className="grid gap-4">
                                        {d.experience.slice(0, 6).map((ex, i) => (
                                            <div
                                                key={`${ex.company}-${ex.role}-${i}`}
                                                className={
                                                    isLight
                                                        ? "rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm"
                                                        : "rounded-3xl border border-white/10 bg-white/5 p-6"
                                                }
                                            >
                                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                    <div className="text-base font-semibold tracking-tight">
                                                        {ex.role || "Role"}
                                                    </div>
                                                    <div className={isLight ? "text-xs text-black/55" : "text-xs text-white/55"}>
                                                        {ex.start}
                                                        {ex.end ? ` — ${ex.end}` : ""}
                                                    </div>
                                                </div>
                                                <div className={isLight ? "mt-1 text-sm text-black/70" : "mt-1 text-sm text-white/70"}>
                                                    {ex.company || "Company"}
                                                    {ex.location ? ` • ${ex.location}` : ""}
                                                </div>
                                                {ex.highlights.length ? (
                                                    <ul className={isLight ? "mt-4 space-y-2 text-sm text-black/70" : "mt-4 space-y-2 text-sm text-white/70"}>
                                                        {ex.highlights.slice(0, 5).map((h, idx) => (
                                                            <li key={idx} className="flex gap-2">
                                                                <span className={isLight ? "text-pink-700/70" : "text-pink-300/70"}>•</span>
                                                                <span>{h}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            </div>
                        ) : null}

                        {d.education.length ? (
                            <div className="mt-16">
                                <Section
                                    id="education"
                                    title="Education"
                                    subtitle="The foundation behind the work."
                                    isLight={isLight}
                                >
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {d.education.map((ed, i) => (
                                            <div
                                                key={`${ed.school}-${i}`}
                                                className={
                                                    isLight
                                                        ? "rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm"
                                                        : "rounded-3xl border border-white/10 bg-white/5 p-6"
                                                }
                                            >
                                                <div className="text-base font-semibold tracking-tight">
                                                    {ed.school || "School"}
                                                </div>
                                                <div className={isLight ? "mt-1 text-sm text-black/70" : "mt-1 text-sm text-white/70"}>
                                                    {ed.degree || "Degree"}
                                                </div>
                                                <div className={isLight ? "mt-2 text-xs text-black/55" : "mt-2 text-xs text-white/55"}>
                                                    {ed.start}
                                                    {ed.end ? ` — ${ed.end}` : ""}
                                                </div>
                                                {ed.notes ? (
                                                    <div className={isLight ? "mt-4 text-sm text-black/65" : "mt-4 text-sm text-white/70"}>
                                                        {ed.notes}
                                                    </div>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            </div>
                        ) : null}
                    </main>

                    {/* Sidebar */}
                    <aside className={ui.sidebar}>
                        <div className={ui.sideTitle}>Muse Notes</div>
                        <div className={ui.sideText}>
                            Aesthetic portfolio layout that feels like a small magazine. Clean spacing, strong cards,
                            and tasteful accents.
                        </div>

                        <div className={ui.divider} />

                        <div className={ui.label}>Signature</div>
                        <div className={ui.val}>{p.fullName || "Your Name"}</div>

                        <div className="mt-5">
                            <div className={ui.label}>Focus</div>
                            <div className={ui.val}>
                                {p.headline || "Add a headline to show what you specialize in."}
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className={ui.label}>Statement</div>
                            <div className={ui.val} style={{ lineHeight: 1.6 }}>
                                “{museQuote}”
                            </div>
                        </div>

                        {d.skills.length ? (
                            <>
                                <div className={ui.divider} />
                                <div className={ui.label}>Skills</div>
                                <div className={ui.sideList}>
                                    {d.skills.slice(0, 24).map((s) => (
                                        <Chip key={s} isLight={isLight}>
                                            {s}
                                        </Chip>
                                    ))}
                                </div>
                            </>
                        ) : null}

                        {links.length ? (
                            <>
                                <div className={ui.divider} />
                                <div className={ui.label}>Links</div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {links.map((l) => (
                                        <Button
                                            key={l.href}
                                            href={l.href}
                                            label={l.label}
                                            variant="secondary"
                                            isLight={isLight}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : null}
                    </aside>
                </div>

                {/* Footer */}
                <div className={ui.footer}>
                    <div className={ui.footerTitle}>Let’s collaborate.</div>
                    <div className={ui.footerText}>
                        If you like the craft and want to work together, reach out. I reply fast.
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                        {p.email ? (
                            <Button
                                href={`mailto:${p.email}`}
                                label="Email me"
                                variant="primary"
                                isLight={isLight}
                            />
                        ) : (
                            <Button href="#work" label="View Work" variant="primary" isLight={isLight} />
                        )}
                        {p.linkedin ? (
                            <Button href={p.linkedin} label="LinkedIn" variant="secondary" isLight={isLight} />
                        ) : null}
                        {p.github ? (
                            <Button href={p.github} label="GitHub" variant="secondary" isLight={isLight} />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return <TemplateMuse draft={defaultDraft} />;
}
