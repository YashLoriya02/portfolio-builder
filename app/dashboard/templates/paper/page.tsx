"use client";

import type { PortfolioDraft } from "@/lib/draft";
import { normalizeDraft } from "@/lib/normalizeDraft";
import { defaultDraft } from "@/lib/draft";

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
    const h2 = isLight
        ? "text-[11px] font-semibold tracking-[0.22em] uppercase text-black/70"
        : "text-[11px] font-semibold tracking-[0.22em] uppercase text-white/70";
    const line = isLight ? "bg-black/10" : "bg-white/10";

    return (
        <section id={id} className="scroll-mt-24">
            <div className="flex items-center gap-4">
                <h2 className={h2}>{title}</h2>
                <div className={`h-px flex-1 ${line}`} />
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}

function InlineLink({
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
        ? "underline underline-offset-4 decoration-black/20 hover:decoration-black/40 text-black/70 hover:text-black transition"
        : "underline underline-offset-4 decoration-white/20 hover:decoration-white/40 text-white/75 hover:text-white transition";

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

function PaperCard({
    title,
    right,
    children,
    isLight,
}: {
    title: string;
    right?: React.ReactNode;
    children: React.ReactNode;
    isLight: boolean;
}) {
    const box = isLight
        ? "rounded-2xl border border-black/10 bg-white p-6"
        : "rounded-2xl border border-white/10 bg-white/5 p-6";

    const t = isLight
        ? "text-base font-semibold tracking-tight text-black"
        : "text-base font-semibold tracking-tight text-white";

    return (
        <div className={box}>
            <div className="flex items-start justify-between gap-3">
                <div className={t}>{title}</div>
                {right ? <div>{right}</div> : null}
            </div>
            <div className={isLight ? "mt-3 text-sm text-black/70" : "mt-3 text-sm text-white/70"}>
                {children}
            </div>
        </div>
    );
}

export function TemplatePaper({ draft }: { draft: PortfolioDraft }) {
    const d = normalizeDraft(draft);
    const p = d.profile;
    const isLight = d.theme === "light";

    const ui = isLight
        ? {
            page: "min-h-screen bg-[#f7f6f2] text-black",
            shell: "mx-auto max-w-4xl px-6 py-12",
            sheet:
                "rounded-3xl border border-black/10 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden",
            header: "px-7 py-10 md:px-10",
            name: "text-3xl md:text-4xl font-semibold tracking-tight",
            headline: "mt-2 text-base text-black/70",
            meta: "mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-black/65",
            separator: "mx-2 text-black/25",
            intro:
                "mt-6 max-w-2xl text-sm leading-relaxed text-black/70",
            nav:
                "sticky top-4 z-10 mx-7 md:mx-10 mt-6 rounded-2xl border border-black/10 bg-white/80 backdrop-blur px-4 py-3 shadow-sm",
            navText: "flex flex-wrap gap-x-4 gap-y-2 text-sm text-black/70",
            navLink:
                "underline underline-offset-4 decoration-black/15 hover:decoration-black/35 hover:text-black transition",
            body: "px-7 pb-10 md:px-10",
            block: "mt-12",
            pills:
                "mt-4 flex flex-wrap gap-2",
            pill:
                "rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-black/70",
            time: "text-xs text-black/55",
            footer:
                "mt-14 rounded-2xl border border-black/10 bg-[#fbfbf8] p-7",
            footerTitle: "text-lg font-semibold tracking-tight text-black",
            footerText: "mt-2 text-sm text-black/70",
        }
        : {
            page: "min-h-screen bg-[#07070B] text-white",
            shell: "mx-auto max-w-4xl px-6 py-12",
            sheet:
                "rounded-3xl border border-white/10 bg-[#0B0B10] shadow-[0_10px_40px_rgba(0,0,0,0.45)] overflow-hidden",
            header: "px-7 py-10 md:px-10",
            name: "text-3xl md:text-4xl font-semibold tracking-tight",
            headline: "mt-2 text-base text-white/75",
            meta: "mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70",
            separator: "mx-2 text-white/25",
            intro:
                "mt-6 max-w-2xl text-sm leading-relaxed text-white/70",
            nav:
                "sticky top-4 z-10 mx-7 md:mx-10 mt-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur px-4 py-3",
            navText: "flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70",
            navLink:
                "underline underline-offset-4 decoration-white/20 hover:decoration-white/40 hover:text-white transition",
            body: "px-7 pb-10 md:px-10",
            block: "mt-12",
            pills: "mt-4 flex flex-wrap gap-2",
            pill:
                "rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/75",
            time: "text-xs text-white/55",
            footer:
                "mt-14 rounded-2xl border border-white/10 bg-black/40 p-7",
            footerTitle: "text-lg font-semibold tracking-tight text-white",
            footerText: "mt-2 text-sm text-white/70",
        };

    const links = [
        p.website ? { label: "Website", href: p.website } : null,
        p.github ? { label: "GitHub", href: p.github } : null,
        p.linkedin ? { label: "LinkedIn", href: p.linkedin } : null,
        p.email ? { label: "Email", href: `mailto:${p.email}` } : null,
        p.phone ? { label: "Phone", href: `tel:${p.phone.replace(/\s+/g, "")}` } : null,
    ].filter(Boolean) as Array<{ label: string; href: string }>;

    const nav = [
        { id: "projects", label: "Projects", show: d.projects.length > 0 },
        { id: "experience", label: "Experience", show: d.experience.length > 0 },
        { id: "skills", label: "Skills", show: d.skills.length > 0 },
        { id: "education", label: "Education", show: d.education.length > 0 },
    ].filter((x) => x.show);

    return (
        <div className={ui.page}>
            <div className={ui.shell}>
                <div className={ui.sheet}>
                    {/* Header */}
                    <header className={ui.header}>
                        <h1 className={ui.name}>{p.fullName || "Your Name"}</h1>
                        <div className={ui.headline}>
                            {p.headline || "A clean, editorial single-page portfolio. Simple. ATS-friendly. Readable."}
                        </div>

                        <div className={ui.meta}>
                            {p.location ? <span>{p.location}</span> : null}
                            {p.location && (p.email || p.website || p.linkedin || p.github || p.phone) ? (
                                <span className={ui.separator}>•</span>
                            ) : null}
                            {links.map((l, i) => (
                                <span key={l.href} className="flex items-center gap-2">
                                    <InlineLink href={l.href} label={l.label} isLight={isLight} />
                                    {i !== links.length - 1 ? (
                                        <span className={ui.separator}>•</span>
                                    ) : null}
                                </span>
                            ))}
                        </div>

                        <p className={ui.intro}>
                            {p.summary ||
                                "Write 2–4 lines that explain what you do, what you’ve built, and what kind of role you’re looking for. Keep it crisp."}
                        </p>

                        {nav.length ? (
                            <nav className={ui.nav}>
                                <div className={ui.navText}>
                                    {nav.map((n) => (
                                        <a key={n.id} href={`#${n.id}`} className={ui.navLink}>
                                            {n.label}
                                        </a>
                                    ))}
                                </div>
                            </nav>
                        ) : null}
                    </header>

                    {/* Body */}
                    <main className={ui.body}>
                        {/* Projects */}
                        {d.projects.length ? (
                            <div className={ui.block}>
                                <Section id="projects" title="Projects" isLight={isLight}>
                                    <div className="space-y-4">
                                        {d.projects.slice(0, 8).map((pr, i) => (
                                            <PaperCard
                                                key={`${pr.name}-${i}`}
                                                title={pr.name || "Untitled project"}
                                                right={
                                                    pr.link ? (
                                                        <InlineLink href={pr.link} label="Open" isLight={isLight} />
                                                    ) : null
                                                }
                                                isLight={isLight}
                                            >
                                                {pr.description ? <div>{pr.description}</div> : null}

                                                {pr.highlights.length ? (
                                                    <ul className="mt-3 space-y-1">
                                                        {pr.highlights.slice(0, 5).map((h, idx) => (
                                                            <li key={idx} className="flex gap-2">
                                                                <span className={isLight ? "text-black/40" : "text-white/40"}>•</span>
                                                                <span>{h}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : null}

                                                {pr.tech.length ? (
                                                    <div className={ui.pills}>
                                                        {pr.tech.slice(0, 12).map((t) => (
                                                            <span key={t} className={ui.pill}>
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : null}
                                            </PaperCard>
                                        ))}
                                    </div>
                                </Section>
                            </div>
                        ) : null}

                        {/* Experience */}
                        {d.experience.length ? (
                            <div className={ui.block}>
                                <Section id="experience" title="Experience" isLight={isLight}>
                                    <div className="space-y-4">
                                        {d.experience.slice(0, 8).map((ex, i) => (
                                            <PaperCard
                                                key={`${ex.company}-${ex.role}-${i}`}
                                                title={`${ex.role || "Role"} · ${ex.company || "Company"}`}
                                                right={
                                                    <span className={ui.time}>
                                                        {ex.start}
                                                        {ex.end ? ` — ${ex.end}` : ""}
                                                    </span>
                                                }
                                                isLight={isLight}
                                            >
                                                {ex.location ? (
                                                    <div className={isLight ? "text-black/60" : "text-white/60"}>
                                                        {ex.location}
                                                    </div>
                                                ) : null}

                                                {ex.highlights.length ? (
                                                    <ul className="mt-3 space-y-1">
                                                        {ex.highlights.slice(0, 6).map((h, idx) => (
                                                            <li key={idx} className="flex gap-2">
                                                                <span className={isLight ? "text-black/40" : "text-white/40"}>•</span>
                                                                <span>{h}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : null}
                                            </PaperCard>
                                        ))}
                                    </div>
                                </Section>
                            </div>
                        ) : null}

                        {/* Skills */}
                        {d.skills.length ? (
                            <div className={ui.block}>
                                <Section id="skills" title="Skills" isLight={isLight}>
                                    <div className="flex flex-wrap gap-2">
                                        {d.skills.slice(0, 80).map((s) => (
                                            <span key={s} className={ui.pill}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </Section>
                            </div>
                        ) : null}

                        {/* Education */}
                        {d.education.length ? (
                            <div className={ui.block}>
                                <Section id="education" title="Education" isLight={isLight}>
                                    <div className="space-y-4">
                                        {d.education.map((ed, i) => (
                                            <PaperCard
                                                key={`${ed.school}-${i}`}
                                                title={ed.school || "School"}
                                                right={
                                                    <span className={ui.time}>
                                                        {ed.start}
                                                        {ed.end ? ` — ${ed.end}` : ""}
                                                    </span>
                                                }
                                                isLight={isLight}
                                            >
                                                <div>{ed.degree || "Degree"}</div>
                                                {ed.notes ? (
                                                    <div className={isLight ? "mt-2 text-black/65" : "mt-2 text-white/70"}>
                                                        {ed.notes}
                                                    </div>
                                                ) : null}
                                            </PaperCard>
                                        ))}
                                    </div>
                                </Section>
                            </div>
                        ) : null}

                        {/* Footer */}
                        <div className={ui.footer}>
                            <div className={ui.footerTitle}>Contact</div>
                            <div className={ui.footerText}>
                                {p.email
                                    ? "Email is the fastest way to reach me."
                                    : "Add your email to enable quick contact."}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                {p.email ? (
                                    <InlineLink href={`mailto:${p.email}`} label={p.email} isLight={isLight} />
                                ) : null}
                                {p.linkedin ? (
                                    <InlineLink href={p.linkedin} label="LinkedIn" isLight={isLight} />
                                ) : null}
                                {p.github ? <InlineLink href={p.github} label="GitHub" isLight={isLight} /> : null}
                                {p.website ? (
                                    <InlineLink href={p.website} label="Website" isLight={isLight} />
                                ) : null}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return <TemplatePaper draft={defaultDraft} />;
}
