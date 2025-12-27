import type { PortfolioDraft } from "@/lib/draft";
import { normalizeDraft } from "@/lib/normalizeDraft";
import { defaultDraft } from "@/lib/draft";

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="mt-10">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <h2 className="text-sm font-semibold tracking-wide uppercase text-white/60">
                    {title}
                </h2>
                <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}

function LinkRow({
    label,
    value,
    href,
}: {
    label: string;
    value: string;
    href?: string;
}) {
    if (!value) return null;
    return (
        <div className="flex flex-wrap items-baseline gap-2 text-sm">
            <span className="w-20 text-white/50">{label}</span>
            {href ? (
                <a className="text-white/80 hover:text-white hover:underline" href={href} target="_blank" rel="noreferrer">
                    {value}
                </a>
            ) : (
                <span className="text-white/80">{value}</span>
            )}
        </div>
    );
}

export function TemplateClassic({ draft }: { draft: PortfolioDraft }) {
    const d = normalizeDraft(draft);
    const p = d.profile;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-5xl px-6 py-12">
                {/* Header */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight">
                                {p.fullName || "Your Name"}
                            </h1>
                            {p.headline ? (
                                <div className="mt-2 text-lg text-white/70">{p.headline}</div>
                            ) : null}
                            {p.location ? (
                                <div className="mt-2 text-sm text-white/50">{p.location}</div>
                            ) : null}
                        </div>

                        <div className="space-y-1">
                            <LinkRow label="Email" value={p.email} href={p.email ? `mailto:${p.email}` : undefined} />
                            <LinkRow label="Phone" value={p.phone} href={p.phone ? `tel:${p.phone.replace(/\s+/g, "")}` : undefined} />
                            <LinkRow label="Website" value={p.website} href={p.website || undefined} />
                            <LinkRow label="GitHub" value={p.github} href={p.github || undefined} />
                            <LinkRow label="LinkedIn" value={p.linkedin} href={p.linkedin || undefined} />
                        </div>
                    </div>

                    <div className="mt-6 max-w-3xl text-white/70 leading-relaxed">
                        {p.summary || "Add a summary to make this page feel like a portfolio homepage."}
                    </div>
                </div>

                {/* Projects */}
                {d.projects.length ? (
                    <Section title="Projects">
                        <div className="grid gap-5 md:grid-cols-2">
                            {d.projects.map((pr, i) => (
                                <div key={`${pr.name}-${i}`} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="font-medium">{pr.name || "Untitled project"}</div>
                                        {pr.link ? (
                                            <a
                                                href={pr.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-white/70 hover:text-white"
                                            >
                                                View ↗
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

                {/* Experience */}
                {d.experience.length ? (
                    <Section title="Experience">
                        <div className="space-y-4">
                            {d.experience.map((ex, i) => (
                                <div key={`${ex.company}-${ex.role}-${i}`} className="rounded-2xl border border-white/10 bg-white/5 p-5">
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
                    </Section>
                ) : null}

                {/* Skills + Education */}
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {d.skills.length ? (
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <h2 className="text-sm font-semibold tracking-wide uppercase text-white/60">
                                Skills
                            </h2>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {d.skills.slice(0, 60).map((s) => (
                                    <span
                                        key={s}
                                        className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {d.education.length ? (
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <h2 className="text-sm font-semibold tracking-wide uppercase text-white/60">
                                Education
                            </h2>
                            <div className="mt-4 space-y-4">
                                {d.education.map((ed, i) => (
                                    <div key={`${ed.school}-${i}`} className="rounded-2xl border border-white/10 bg-black/30 p-4">
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
                        </div>
                    ) : null}
                </div>

                {/* <footer className="mt-14 pb-8 text-center text-xs text-white/50">
                    {p.fullName ? `${p.fullName} • ` : ""}Single-page portfolio
                </footer> */}
            </div>
        </div>
    );
}

export default function Page() {
    return <TemplateClassic draft={defaultDraft} />;
}
