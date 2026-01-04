import type { PortfolioDraft } from "@/lib/draft";
import { normalizeDraft } from "@/lib/normalizeDraft";
import { defaultDraft } from "@/lib/draft";

function Section({
    title,
    children,
    isLight,
}: {
    title: string;
    children: React.ReactNode;
    isLight: boolean;
}) {
    const line = isLight ? "bg-black/10" : "bg-white/10";
    const titleCls = isLight
        ? "text-sm font-semibold tracking-wide uppercase text-black/60"
        : "text-sm font-semibold tracking-wide uppercase text-white/60";

    return (
        <section className="mt-10">
            <div className="flex items-center gap-3">
                <div className={`h-px flex-1 ${line}`} />
                <h2 className={titleCls}>{title}</h2>
                <div className={`h-px flex-1 ${line}`} />
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}

function LinkRow({
    label,
    value,
    href,
    isLight,
}: {
    label: string;
    value: string;
    href?: string;
    isLight: boolean;
}) {
    if (!value) return null;

    const labelCls = isLight ? "w-20 text-black/50" : "w-20 text-white/50";
    const valueCls = isLight ? "text-black/80" : "text-white/80";
    const linkCls = isLight
        ? "text-black/80 hover:text-black hover:underline"
        : "text-white/80 hover:text-white hover:underline";

    return (
        <div className="flex flex-wrap items-baseline gap-2 text-sm">
            <span className={labelCls}>{label}</span>
            {href ? (
                <a className={linkCls} href={href} target="_blank" rel="noreferrer">
                    {value}
                </a>
            ) : (
                <span className={valueCls}>{value}</span>
            )}
        </div>
    );
}

export function TemplateClassic({ draft }: { draft: PortfolioDraft }) {
    const d = normalizeDraft(draft);
    const p = d.profile;

    const isLight = d.theme === "light";

    const ui = isLight
        ? {
            page: "min-h-screen bg-white text-black",
            header: "rounded-3xl border border-black/10 bg-black/[0.03] p-8",
            muted70: "text-black/70",
            muted60: "text-black/60",
            muted50: "text-black/50",
            card: "rounded-2xl border border-black/10 bg-black/[0.03] p-5",
            cardHover:
                "rounded-2xl border border-black/10 bg-black/[0.03] p-5 hover:bg-black/[0.05] transition",
            chip:
                "rounded-full border border-black/10 bg-black/[0.04] px-3 py-1 text-xs text-black/70",
            inner:
                "rounded-2xl border border-black/10 bg-black/[0.02] p-4",
            link: "text-sm text-black/60 hover:text-black",
            box: "rounded-3xl border border-black/10 bg-black/[0.03] p-6",
            boxTitle:
                "text-sm font-semibold tracking-wide uppercase text-black/60",
        }
        : {
            page: "min-h-screen bg-black text-white",
            header: "rounded-3xl border border-white/10 bg-white/5 p-8",
            muted70: "text-white/70",
            muted60: "text-white/60",
            muted50: "text-white/50",
            card: "rounded-2xl border border-white/10 bg-white/5 p-5",
            cardHover:
                "rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/7 transition",
            chip:
                "rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70",
            inner: "rounded-2xl border border-white/10 bg-black/30 p-4",
            link: "text-sm text-white/70 hover:text-white",
            box: "rounded-3xl border border-white/10 bg-white/5 p-6",
            boxTitle:
                "text-sm font-semibold tracking-wide uppercase text-white/60",
        };

    return (
        <div className={ui.page}>
            <div className="mx-auto max-w-5xl px-6 py-12">
                {/* Header */}
                <div className={ui.header}>
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight">
                                {p.fullName || "Your Name"}
                            </h1>

                            {p.headline ? (
                                <div className={["mt-2 text-lg", ui.muted70].join(" ")}>
                                    {p.headline}
                                </div>
                            ) : null}

                            {p.location ? (
                                <div className={["mt-2 text-sm", ui.muted50].join(" ")}>
                                    {p.location}
                                </div>
                            ) : null}
                        </div>

                        <div className="space-y-1">
                            <LinkRow
                                label="Email"
                                value={p.email}
                                href={p.email ? `mailto:${p.email}` : undefined}
                                isLight={isLight}
                            />
                            <LinkRow
                                label="Phone"
                                value={p.phone}
                                href={p.phone ? `tel:${p.phone.replace(/\s+/g, "")}` : undefined}
                                isLight={isLight}
                            />
                            <LinkRow
                                label="Website"
                                value={p.website}
                                href={p.website || undefined}
                                isLight={isLight}
                            />
                            <LinkRow
                                label="GitHub"
                                value={p.github}
                                href={p.github || undefined}
                                isLight={isLight}
                            />
                            <LinkRow
                                label="LinkedIn"
                                value={p.linkedin}
                                href={p.linkedin || undefined}
                                isLight={isLight}
                            />
                        </div>
                    </div>

                    <div className={["mt-6 max-w-3xl leading-relaxed", ui.muted70].join(" ")}>
                        {p.summary || "Add a summary to make this page feel like a portfolio homepage."}
                    </div>
                </div>

                {/* Projects */}
                {d.projects.length ? (
                    <Section title="Projects" isLight={isLight}>
                        <div className="grid gap-5 md:grid-cols-2">
                            {d.projects.map((pr, i) => (
                                <div key={`${pr.name}-${i}`} className={ui.card}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="font-medium">{pr.name || "Untitled project"}</div>
                                        {pr.link ? (
                                            <a href={pr.link} target="_blank" rel="noreferrer" className={ui.link}>
                                                View ↗
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
                                                <span key={t} className={ui.chip}>
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
                    <Section title="Experience" isLight={isLight}>
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

                {/* Skills + Education */}
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {d.skills.length ? (
                        <div className={ui.box}>
                            <h2 className={ui.boxTitle}>Skills</h2>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {d.skills.slice(0, 60).map((s) => (
                                    <span key={s} className={ui.chip}>
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {d.education.length ? (
                        <div className={ui.box}>
                            <h2 className={ui.boxTitle}>Education</h2>
                            <div className="mt-4 space-y-4">
                                {d.education.map((ed, i) => (
                                    <div key={`${ed.school}-${i}`} className={ui.inner}>
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
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return <TemplateClassic draft={defaultDraft} />;
}
