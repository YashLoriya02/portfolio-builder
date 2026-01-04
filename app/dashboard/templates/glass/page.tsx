"use client";

import type { PortfolioDraft } from "@/lib/draft";

type LinkItem = { label: string; href: string };

function ExternalLink({
    href,
    children,
    isLight,
}: {
    href: string;
    children: React.ReactNode;
    isLight: boolean;
}) {
    const isMail = href.startsWith("mailto:");
    const isTel = href.startsWith("tel:");

    const cls = isLight
        ? "rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm text-black/80 hover:bg-white transition shadow-sm"
        : "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition";

    return (
        <a
            href={href}
            target={isMail || isTel ? undefined : "_blank"}
            rel={isMail || isTel ? undefined : "noreferrer"}
            className={cls}
        >
            {children}
        </a>
    );
}

function Section({
    title,
    children,
    isLight,
}: {
    title: string;
    children: React.ReactNode;
    isLight: boolean;
}) {
    return (
        <section className="mt-10">
            <h2
                className={[
                    "text-lg font-semibold tracking-tight",
                    isLight ? "text-black" : "text-white",
                ].join(" ")}
            >
                {title}
            </h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

export default function GlassTemplate({ draft }: { draft: PortfolioDraft }) {
    const p = draft?.profile;

    const isLight = (draft as any)?.theme === "light";

    const ui = isLight
        ? {
            shell:
                "relative min-h-175 w-full rounded-3xl overflow-hidden bg-[#f7f8fb] text-black",
            blob: "opacity-70",
            blobA:
                "absolute -top-28 left-1/3 h-80 w-80 rounded-full bg-black/10 blur-3xl",
            blobB:
                "absolute top-1/2 -right-28 h-80 w-80 rounded-full bg-black/10 blur-3xl",
            hero:
                "rounded-3xl border border-black/10 bg-white/60 p-8 backdrop-blur-xl shadow-sm",
            card:
                "rounded-2xl border border-black/10 bg-white/60 p-5 backdrop-blur-xl shadow-sm",
            chip:
                "rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/70",
            techChip:
                "rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/70",
            muted70: "text-black/70",
            muted60: "text-black/60",
            muted50: "text-black/50",
            link: "text-sm text-black/60 hover:text-black",
        }
        : {
            shell:
                "relative min-h-175 w-full rounded-3xl overflow-hidden bg-black text-white",
            blob: "opacity-70",
            blobA:
                "absolute -top-28 left-1/3 h-80 w-80 rounded-full bg-white/10 blur-3xl",
            blobB:
                "absolute top-1/2 -right-28 h-80 w-80 rounded-full bg-white/10 blur-3xl",
            hero:
                "rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur",
            card:
                "rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur",
            chip:
                "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70",
            techChip:
                "rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70",
            muted70: "text-white/70",
            muted60: "text-white/60",
            muted50: "text-white/50",
            link: "text-sm text-white/70 hover:text-white",
        };

    const links: LinkItem[] = [
        p?.website ? { label: "Website", href: p?.website } : null,
        p?.github ? { label: "GitHub", href: p?.github } : null,
        p?.linkedin ? { label: "LinkedIn", href: p?.linkedin } : null,
        p?.email ? { label: "Email", href: `mailto:${p?.email}` } : null,
        p?.phone ? { label: "Call", href: `tel:${p?.phone.replace(/\s+/g, "")}` } : null,
    ].filter(Boolean) as LinkItem[];

    return (
        <div className={ui.shell}>
            {/* background */}
            <div className={`pointer-events-none absolute inset-0 ${ui.blob}`}>
                <div className={ui.blobA} />
                <div className={ui.blobB} />
            </div>

            <div className="relative mx-auto max-w-5xl px-6 py-10">
                {/* HERO */}
                <div className={ui.hero}>
                    <div className="text-4xl font-semibold tracking-tight">
                        {p?.fullName || "Your Name"}
                    </div>

                    {p?.headline ? (
                        <div className={["mt-2", ui.muted70].join(" ")}>{p?.headline}</div>
                    ) : null}

                    {(p?.location || p?.email) ? (
                        <div className={["mt-3 text-sm", ui.muted60].join(" ")}>
                            {p?.location ? <span>{p?.location}</span> : null}
                            {p?.location && p?.email ? <span className="mx-2">•</span> : null}
                            {p?.email ? <span>{p?.email}</span> : null}
                        </div>
                    ) : null}

                    {p?.summary ? (
                        <p className={["mt-5 max-w-2xl leading-relaxed", ui.muted70].join(" ")}>
                            {p?.summary}
                        </p>
                    ) : (
                        <p className={["mt-5 max-w-2xl leading-relaxed", ui.muted50].join(" ")}>
                            Add a summary to make this portfolio feel personal and website-like.
                        </p>
                    )}

                    {links.length ? (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {links.map((l) => (
                                <ExternalLink key={l.href} href={l.href} isLight={isLight}>
                                    {l.label}
                                </ExternalLink>
                            ))}
                        </div>
                    ) : null}
                </div>

                {/* PROJECTS */}
                {draft?.projects.length ? (
                    <Section title="Projects" isLight={isLight}>
                        <div className="grid gap-4 md:grid-cols-2">
                            {draft?.projects.map((pr, i) => (
                                <div key={`${pr.name}-${i}`} className={ui.card}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="font-medium">{pr.name || "Untitled project"}</div>

                                        {pr.link ? (
                                            <a href={pr.link} target="_blank" rel="noreferrer" className={ui.link}>
                                                ↗
                                            </a>
                                        ) : null}
                                    </div>

                                    {pr.description ? (
                                        <p className={["mt-2 text-sm", ui.muted70].join(" ")}>
                                            {pr.description}
                                        </p>
                                    ) : null}

                                    {pr.highlights.length ? (
                                        <ul className={["mt-3 list-disc pl-5 text-sm space-y-1", ui.muted70].join(" ")}>
                                            {pr.highlights.slice(0, 4).map((h, idx) => (
                                                <li key={idx}>{h}</li>
                                            ))}
                                        </ul>
                                    ) : null}

                                    {pr.tech.length ? (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {pr.tech.slice(0, 10).map((t) => (
                                                <span key={t} className={ui.techChip}>
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
                {draft?.experience.length ? (
                    <Section title="Experience" isLight={isLight}>
                        <div className="space-y-4">
                            {draft?.experience.map((ex, i) => (
                                <div key={`${ex.company}-${ex.role}-${i}`} className={ui.card}>
                                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <div className="font-medium">{ex.role || "Role"}</div>
                                        <div className={["text-xs", ui.muted60].join(" ")}>
                                            {ex.start}
                                            {ex.end ? ` — ${ex.end}` : ""}
                                        </div>
                                    </div>

                                    <div className={["mt-1 text-sm", ui.muted70].join(" ")}>
                                        {ex.company || "Company"}
                                        {ex.location ? ` • ${ex.location}` : ""}
                                    </div>

                                    {ex.highlights.length ? (
                                        <ul className={["mt-3 list-disc pl-5 text-sm space-y-1", ui.muted70].join(" ")}>
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
                {draft?.skills.length ? (
                    <Section title="Skills" isLight={isLight}>
                        <div className="flex flex-wrap gap-2">
                            {draft?.skills.slice(0, 60).map((s) => (
                                <span key={s} className={ui.chip}>
                                    {s}
                                </span>
                            ))}
                        </div>
                    </Section>
                ) : null}

                {/* EDUCATION */}
                {draft?.education.length ? (
                    <Section title="Education" isLight={isLight}>
                        <div className="grid gap-4 md:grid-cols-2">
                            {draft?.education.map((ed, i) => (
                                <div key={`${ed.school}-${i}`} className={ui.card}>
                                    <div className="font-medium">{ed.school || "School"}</div>
                                    <div className={["mt-1 text-sm", ui.muted70].join(" ")}>
                                        {ed.degree || "Degree"}
                                    </div>
                                    <div className={["mt-2 text-xs", ui.muted60].join(" ")}>
                                        {ed.start}
                                        {ed.end ? ` — ${ed.end}` : ""}
                                    </div>
                                    {ed.notes ? (
                                        <div className={["mt-3 text-sm", ui.muted70].join(" ")}>
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
    );
}
