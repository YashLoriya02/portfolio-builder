"use client";

import type { PortfolioDraft } from "@/lib/draft";

type LinkItem = { label: string; href: string };

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
    const isMail = href.startsWith("mailto:");
    const isTel = href.startsWith("tel:");
    return (
        <a
            href={href}
            target={isMail || isTel ? undefined : "_blank"}
            rel={isMail || isTel ? undefined : "noreferrer"}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
        >
            {children}
        </a>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="mt-10">
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

export default function GlassTemplate({ draft }: { draft: PortfolioDraft }) {
    const p = draft.profile;

    const links: LinkItem[] = [
        p.website ? { label: "Website", href: p.website } : null,
        p.github ? { label: "GitHub", href: p.github } : null,
        p.linkedin ? { label: "LinkedIn", href: p.linkedin } : null,
        p.email ? { label: "Email", href: `mailto:${p.email}` } : null,
        p.phone ? { label: "Call", href: `tel:${p.phone.replace(/\s+/g, "")}` } : null,
    ].filter(Boolean) as LinkItem[];

    return (
        <div className="relative min-h-175 w-full rounded-3xl overflow-hidden bg-black text-white">
            {/* background */}
            <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute -top-28 left-1/3 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute top-1/2 -right-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-5xl px-6 py-10">
                {/* HERO */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                    <div className="text-4xl font-semibold tracking-tight">
                        {p.fullName || "Your Name"}
                    </div>

                    {p.headline ? (
                        <div className="mt-2 text-white/70">{p.headline}</div>
                    ) : null}

                    {(p.location || p.email) ? (
                        <div className="mt-3 text-sm text-white/60">
                            {p.location ? <span>{p.location}</span> : null}
                            {p.location && p.email ? <span className="mx-2">•</span> : null}
                            {p.email ? <span>{p.email}</span> : null}
                        </div>
                    ) : null}

                    {p.summary ? (
                        <p className="mt-5 max-w-2xl text-white/70 leading-relaxed">
                            {p.summary}
                        </p>
                    ) : (
                        <p className="mt-5 max-w-2xl text-white/50 leading-relaxed">
                            Add a summary to make this portfolio feel personal and website-like.
                        </p>
                    )}

                    {links.length ? (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {links.map((l) => (
                                <ExternalLink key={l.href} href={l.href}>
                                    {l.label}
                                </ExternalLink>
                            ))}
                        </div>
                    ) : null}
                </div>

                {/* PROJECTS */}
                {draft.projects.length ? (
                    <Section title="Projects">
                        <div className="grid gap-4 md:grid-cols-2">
                            {draft.projects.map((pr, i) => (
                                <div
                                    key={`${pr.name}-${i}`}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="font-medium">{pr.name || "Untitled project"}</div>
                                        {pr.link ? (
                                            <a
                                                href={pr.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-white/70 hover:text-white"
                                            >
                                                ↗
                                            </a>
                                        ) : null}
                                    </div>

                                    {pr.description ? (
                                        <p className="mt-2 text-sm text-white/70">{pr.description}</p>
                                    ) : null}

                                    {pr.highlights.length ? (
                                        <ul className="mt-3 list-disc pl-5 text-sm text-white/70 space-y-1">
                                            {pr.highlights.slice(0, 4).map((h, idx) => (
                                                <li key={idx}>{h}</li>
                                            ))}
                                        </ul>
                                    ) : null}

                                    {pr.tech.length ? (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {pr.tech.slice(0, 10).map((t) => (
                                                <span
                                                    key={t}
                                                    className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </Section>
                ) : null}

                {/* EXPERIENCE */}
                {draft.experience.length ? (
                    <Section title="Experience">
                        <div className="space-y-4">
                            {draft.experience.map((ex, i) => (
                                <div
                                    key={`${ex.company}-${ex.role}-${i}`}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                                >
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <div className="font-medium">{ex.role || "Role"}</div>
                                        <div className="text-xs text-white/60">
                                            {ex.start}
                                            {ex.end ? ` — ${ex.end}` : ""}
                                        </div>
                                    </div>

                                    <div className="mt-1 text-sm text-white/70">
                                        {ex.company || "Company"}
                                        {ex.location ? ` • ${ex.location}` : ""}
                                    </div>

                                    {ex.highlights.length ? (
                                        <ul className="mt-3 list-disc pl-5 text-sm text-white/70 space-y-1">
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

                {/* SKILLS */}
                {draft.skills.length ? (
                    <Section title="Skills">
                        <div className="flex flex-wrap gap-2">
                            {draft.skills.slice(0, 60).map((s) => (
                                <span
                                    key={s}
                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </Section>
                ) : null}

                {/* EDUCATION */}
                {draft.education.length ? (
                    <Section title="Education">
                        <div className="grid gap-4 md:grid-cols-2">
                            {draft.education.map((ed, i) => (
                                <div
                                    key={`${ed.school}-${i}`}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                                >
                                    <div className="font-medium">{ed.school || "School"}</div>
                                    <div className="mt-1 text-sm text-white/70">
                                        {ed.degree || "Degree"}
                                    </div>
                                    <div className="mt-2 text-xs text-white/60">
                                        {ed.start}
                                        {ed.end ? ` — ${ed.end}` : ""}
                                    </div>
                                    {ed.notes ? (
                                        <div className="mt-3 text-sm text-white/70">{ed.notes}</div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </Section>
                ) : null}

                {/* FOOTER */}
                {/* <footer className="mt-14 pb-10 text-center text-xs text-white/50">
                    {p.fullName ? `${p.fullName} • ` : ""}Portfolio Website
                </footer> */}
            </div>
        </div>
    );
}
