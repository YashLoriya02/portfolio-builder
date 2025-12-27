import type { PortfolioDraft } from "@/lib/draft";
import { normalizeDraft } from "@/lib/normalizeDraft";
import { defaultDraft } from "@/lib/draft";

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            {children}
        </span>
    );
}

function CTA({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
    const isMail = href.startsWith("mailto:");
    const isTel = href.startsWith("tel:");
    return (
        <a
            href={href}
            target={isMail || isTel ? undefined : "_blank"}
            rel={isMail || isTel ? undefined : "noreferrer"}
            className={
                primary
                    ? "rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                    : "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
            }
        >
            {label}
        </a>
    );
}

export function TemplateNeo({ draft }: { draft: PortfolioDraft }) {
    const d = normalizeDraft(draft);
    const p = d.profile;

    const links = [
        p.website ? { label: "Website", href: p.website } : null,
        p.github ? { label: "GitHub", href: p.github } : null,
        p.linkedin ? { label: "LinkedIn", href: p.linkedin } : null,
        p.email ? { label: "Email", href: `mailto:${p.email}` } : null,
    ].filter(Boolean) as Array<{ label: string; href: string }>;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* glow */}
            <div className="pointer-events-none fixed inset-0 opacity-60">
                <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-6xl px-6 py-12">
                {/* Hero */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div>
                            <div className="text-5xl font-semibold tracking-tight">
                                {p.fullName || "Your Name"}
                            </div>
                            {p.headline ? (
                                <div className="mt-3 text-lg text-white/70">{p.headline}</div>
                            ) : null}

                            <div className="mt-4 flex flex-wrap gap-2">
                                {p.location ? <Pill>{p.location}</Pill> : null}
                                {p.email ? <Pill>{p.email}</Pill> : null}
                            </div>
                        </div>

                        {links.length ? (
                            <div className="flex flex-wrap gap-2">
                                <CTA href={links[0].href} label={links[0].label} primary />
                                {links.slice(1).map((l) => (
                                    <CTA key={l.href} href={l.href} label={l.label} />
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <p className="mt-6 max-w-3xl text-white/70 leading-relaxed">
                        {p.summary || "Add a summary. This area is meant to feel like a creator homepage intro."}
                    </p>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* Projects + Experience */}
                    <div className="space-y-8">
                        {d.projects.length ? (
                            <section>
                                <div className="flex items-end justify-between">
                                    <h2 className="text-xl font-semibold">Projects</h2>
                                    <div className="text-sm text-white/50">Selected work</div>
                                </div>

                                <div className="mt-4 grid gap-4 md:grid-cols-2">
                                    {d.projects.map((pr, i) => (
                                        <article
                                            key={`${pr.name}-${i}`}
                                            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/7 transition"
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
                                                        <Pill key={t}>{t}</Pill>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ) : null}

                        {d.experience.length ? (
                            <section>
                                <h2 className="text-xl font-semibold">Experience</h2>

                                <div className="mt-4 space-y-4">
                                    {d.experience.map((ex, i) => (
                                        <div
                                            key={`${ex.company}-${ex.role}-${i}`}
                                            className="rounded-2xl border border-white/10 bg-white/5 p-5"
                                        >
                                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                <div className="font-medium">{ex.role || "Role"}</div>
                                                <div className="text-xs text-white/60">
                                                    {ex.start}{ex.end ? ` — ${ex.end}` : ""}
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
                            </section>
                        ) : null}
                    </div>

                    {/* Skills + Education */}
                    <div className="space-y-8">
                        {d.skills.length ? (
                            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                                <h2 className="text-lg font-semibold">Skills</h2>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {d.skills.slice(0, 60).map((s) => (
                                        <Pill key={s}>{s}</Pill>
                                    ))}
                                </div>
                            </section>
                        ) : null}

                        {d.education.length ? (
                            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                                <h2 className="text-lg font-semibold">Education</h2>
                                <div className="mt-4 space-y-4">
                                    {d.education.map((ed, i) => (
                                        <div
                                            key={`${ed.school}-${i}`}
                                            className="rounded-2xl border border-white/10 bg-black/30 p-4"
                                        >
                                            <div className="font-medium">{ed.school || "School"}</div>
                                            <div className="mt-1 text-sm text-white/70">{ed.degree || "Degree"}</div>
                                            <div className="mt-2 text-xs text-white/60">
                                                {ed.start}{ed.end ? ` — ${ed.end}` : ""}
                                            </div>
                                            {ed.notes ? (
                                                <div className="mt-3 text-sm text-white/70">{ed.notes}</div>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : null}
                    </div>
                </div>

                {/* <footer className="mt-14 pb-8 text-center text-xs text-white/50">
                    {p.fullName ? `${p.fullName} • ` : ""}Single-page portfolio
                </footer> */}
            </div>
        </div>
    );
}

export default function Page() {
    return <TemplateNeo draft={defaultDraft} />;
}
