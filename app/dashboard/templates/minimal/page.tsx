import type { PortfolioDraft } from "@/lib/draft";
import { normalizeDraft } from "@/lib/normalizeDraft";
import { defaultDraft } from "@/lib/draft";

function ExternalLink({ href, label }: { href: string; label: string }) {
    const isMail = href.startsWith("mailto:");
    const isTel = href.startsWith("tel:");
    return (
        <a
            href={href}
            target={isMail || isTel ? undefined : "_blank"}
            rel={isMail || isTel ? undefined : "noreferrer"}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 transition"
        >
            {label}
        </a>
    );
}

function Section({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-20">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-white/55">
                {title}
            </h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

export function TemplateMinimal({ draft }: { draft: PortfolioDraft }) {
    const d = normalizeDraft(draft);
    const p = d.profile;

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
        <div className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-5xl px-6 py-12">
                {/* Top */}
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight">
                            {p.fullName || "Your Name"}
                        </h1>
                        {p.headline ? (
                            <p className="mt-2 text-lg text-white/70">{p.headline}</p>
                        ) : null}
                        {p.location ? (
                            <p className="mt-2 text-sm text-white/50">{p.location}</p>
                        ) : null}
                    </div>

                    {links.length ? (
                        <div className="flex flex-wrap gap-2">
                            {links.map((l) => (
                                <ExternalLink key={l.href} href={l.href} label={l.label} />
                            ))}
                        </div>
                    ) : null}
                </div>

                {/* Summary */}
                <div className="mt-8 max-w-3xl">
                    <p className="text-base leading-relaxed text-white/75">
                        {p.summary || "Add a short summary to introduce yourself."}
                    </p>
                </div>

                {/* Sticky nav */}
                {nav.length ? (
                    <div className="mt-10 sticky top-4 z-10">
                        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3">
                            <div className="flex flex-wrap gap-3 text-sm text-white/70">
                                {nav.map((n) => (
                                    <a
                                        key={n.id}
                                        href={`#${n.id}`}
                                        className="hover:text-white transition"
                                    >
                                        {n.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="mt-10 space-y-14">
                    {/* Projects */}
                    {d.projects.length ? (
                        <Section id="projects" title="Projects">
                            <div className="grid gap-5 md:grid-cols-2">
                                {d.projects.map((pr, i) => (
                                    <article
                                        key={`${pr.name}-${i}`}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-5"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="font-medium">
                                                {pr.name || "Untitled project"}
                                            </h3>
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
                                            <p className="mt-2 text-sm text-white/70">
                                                {pr.description}
                                            </p>
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
                                                        className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-white/70"
                                                    >
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
                        <Section id="experience" title="Experience">
                            <div className="space-y-4">
                                {d.experience.map((ex, i) => (
                                    <div
                                        key={`${ex.company}-${ex.role}-${i}`}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-5"
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

                    {/* Skills */}
                    {d.skills.length ? (
                        <Section id="skills" title="Skills">
                            <div className="flex flex-wrap gap-2">
                                {d.skills.slice(0, 60).map((s) => (
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

                    {/* Education */}
                    {d.education.length ? (
                        <Section id="education" title="Education">
                            <div className="grid gap-5 md:grid-cols-2">
                                {d.education.map((ed, i) => (
                                    <div
                                        key={`${ed.school}-${i}`}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-5"
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
                </div>

                {/* <footer className="mt-16 border-t border-white/10 pt-8 text-xs text-white/50">
                    {p.fullName ? `${p.fullName} • ` : ""}Single-page portfolio
                </footer> */}
            </div>
        </div>
    );
}

export default function Page() {
    return <TemplateMinimal draft={defaultDraft} />;
}
