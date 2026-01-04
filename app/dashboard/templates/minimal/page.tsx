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
        ? "inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-sm text-black/70 hover:bg-black/[0.06] transition"
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
    return (
        <section id={id} className="scroll-mt-20">
            <h2
                className={[
                    "text-sm font-semibold tracking-wide uppercase",
                    isLight ? "text-black/55" : "text-white/55",
                ].join(" ")}
            >
                {title}
            </h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

export function TemplateMinimal({ draft }: { draft: PortfolioDraft }) {
    const d = normalizeDraft(draft);
    const p = d.profile;

    const isLight = d.theme === "light";

    const ui = isLight
        ? {
            page: "min-h-screen bg-white text-black",
            muted70: "text-black/70",
            muted60: "text-black/60",
            muted50: "text-black/50",
            navWrap:
                "rounded-2xl border border-black/10 bg-black/[0.03] backdrop-blur px-4 py-3",
            card: "rounded-2xl border border-black/10 bg-black/[0.03] p-5",
            chip: "rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-black/70",
            techChip:
                "rounded-full border border-black/10 bg-black/[0.04] px-2.5 py-1 text-xs text-black/70",
            projLink: "text-sm text-black/60 hover:text-black",
        }
        : {
            page: "min-h-screen bg-black text-white",
            muted70: "text-white/70",
            muted60: "text-white/60",
            muted50: "text-white/50",
            navWrap:
                "rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3",
            card: "rounded-2xl border border-white/10 bg-white/5 p-5",
            chip: "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70",
            techChip:
                "rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-white/70",
            projLink: "text-sm text-white/70 hover:text-white",
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
            <div className="mx-auto max-w-5xl px-6 py-12">
                {/* Top */}
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight">
                            {p.fullName || "Your Name"}
                        </h1>

                        {p.headline ? (
                            <p className={["mt-2 text-lg", ui.muted70].join(" ")}>
                                {p.headline}
                            </p>
                        ) : null}

                        {p.location ? (
                            <p className={["mt-2 text-sm", ui.muted50].join(" ")}>
                                {p.location}
                            </p>
                        ) : null}
                    </div>

                    {links.length ? (
                        <div className="flex flex-wrap gap-2">
                            {links.map((l) => (
                                <ExternalLink
                                    key={l.href}
                                    href={l.href}
                                    label={l.label}
                                    isLight={isLight}
                                />
                            ))}
                        </div>
                    ) : null}
                </div>

                <div className="mt-8 max-w-full">
                    <p className={["text-base leading-relaxed", isLight ? "text-black/75" : "text-white/75"].join(" ")}>
                        {p.summary || "Add a short summary to introduce yourself."}
                    </p>
                </div>

                {nav.length ? (
                    <div className="mt-10 sticky top-4 z-10">
                        <div className={ui.navWrap}>
                            <div className={["flex flex-wrap gap-3 text-sm", ui.muted70].join(" ")}>
                                {nav.map((n) => (
                                    <a
                                        key={n.id}
                                        href={`#${n.id}`}
                                        className={isLight ? "hover:text-black transition" : "hover:text-white transition"}
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
                        <Section id="projects" title="Projects" isLight={isLight}>
                            <div className="grid gap-5 md:grid-cols-2">
                                {d.projects.map((pr, i) => (
                                    <article key={`${pr.name}-${i}`} className={ui.card}>
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="font-medium">
                                                {pr.name || "Untitled project"}
                                            </h3>

                                            {pr.link ? (
                                                <a
                                                    href={pr.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={ui.projLink}
                                                >
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
                                            <ul
                                                className={[
                                                    "mt-3 list-disc pl-5 text-sm space-y-1",
                                                    ui.muted70,
                                                ].join(" ")}
                                            >
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
                                    </article>
                                ))}
                            </div>
                        </Section>
                    ) : null}

                    {/* Experience */}
                    {d.experience.length ? (
                        <Section id="experience" title="Experience" isLight={isLight}>
                            <div className="space-y-4">
                                {d.experience.map((ex, i) => (
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
                                            <ul
                                                className={[
                                                    "mt-3 list-disc pl-5 text-sm space-y-1",
                                                    ui.muted70,
                                                ].join(" ")}
                                            >
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
                        <Section id="skills" title="Skills" isLight={isLight}>
                            <div className="flex flex-wrap gap-2">
                                {d.skills.slice(0, 60).map((s) => (
                                    <span key={s} className={ui.chip}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </Section>
                    ) : null}

                    {/* Education */}
                    {d.education.length ? (
                        <Section id="education" title="Education" isLight={isLight}>
                            <div className="grid gap-5 md:grid-cols-2">
                                {d.education.map((ed, i) => (
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
        </div>
    );
}

export default function Page() {
    return <TemplateMinimal draft={defaultDraft} />;
}
