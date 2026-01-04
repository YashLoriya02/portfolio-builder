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
        ? "rounded-full border border-emerald-600/20 bg-emerald-600/10 px-3 py-1 text-xs text-emerald-800"
        : "rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200/90";

    return <span className={cls}>{children}</span>;
}

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
        ? "inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black/80 hover:bg-black/[0.03] transition shadow-sm"
        : "inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition";

    const dollar = isLight ? "text-black/40" : "text-white/45";

    return (
        <a
            href={href}
            target={isMail || isTel ? undefined : "_blank"}
            rel={isMail || isTel ? undefined : "noreferrer"}
            className={cls}
        >
            <span className={dollar}>$</span>
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
    const arrow = isLight ? "text-emerald-700/70" : "text-emerald-300/70";
    const h2 = isLight
        ? "font-mono text-sm uppercase tracking-widest text-black/70"
        : "font-mono text-sm uppercase tracking-widest text-white/70";
    const line = isLight ? "bg-black/10" : "bg-white/10";

    return (
        <section id={id} className="scroll-mt-24">
            <div className="flex items-center gap-3">
                <span className={arrow}>➜</span>
                <h2 className={h2}>{title}</h2>
                <div className={`h-px flex-1 ${line}`} />
            </div>
            <div className="mt-5">{children}</div>
        </section>
    );
}

export function TemplateTerminal({ draft }: { draft: PortfolioDraft }) {
    const d = normalizeDraft(draft);
    const p = d.profile;

    const isLight = d.theme === "light";

    const ui = isLight
        ? {
            page: "min-h-screen bg-[#fbfbf8] text-black",
            frame:
                "rounded-2xl border border-black/10 bg-white/70 backdrop-blur-xl shadow-[0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden",
            topbar:
                "flex items-center justify-between gap-4 px-4 py-3 border-b border-black/10 bg-black/[0.03]",
            title: "text-xs text-black/60 font-mono",
            ver: "text-xs text-black/35 font-mono",
            prompt: "font-mono text-sm text-black/70",
            user: "text-emerald-800/80",
            colon: "text-black/45",
            path: "text-cyan-800/70",
            dollar: "text-black/45",
            headline: "mt-2 text-black/75",
            summaryBox: "mt-6 rounded-xl border border-black/10 bg-white/70 p-4",
            summaryText: "text-sm leading-relaxed text-black/70",
            navBox: "rounded-xl border border-black/10 bg-white/70 backdrop-blur px-4 py-3 shadow-sm",
            navText: "flex flex-wrap gap-3 text-sm font-mono text-black/65",
            navLink: "hover:text-black transition",
            card:
                "rounded-xl border border-black/10 bg-white/70 p-5 hover:bg-white transition shadow-sm",
            cardLink: "text-sm text-black/60 hover:text-black",
            body: "text-sm text-black/70",
            time: "text-xs text-black/60",
            tech:
                "rounded-md border border-black/10 bg-black/[0.03] px-2 py-1 text-xs text-black/70",
            skill:
                "rounded-md border border-black/10 bg-black/[0.03] px-2.5 py-1 text-xs text-black/70 hover:bg-black/[0.06] transition",
            bullet: "text-emerald-700/70",
        }
        : {
            page: "min-h-screen bg-[#070A08] text-white",
            frame:
                "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden",
            topbar:
                "flex items-center justify-between gap-4 px-4 py-3 border-b border-white/10 bg-black/30",
            title: "text-xs text-white/60 font-mono",
            ver: "text-xs text-white/35 font-mono",
            prompt: "font-mono text-sm text-white/70",
            user: "text-emerald-300/80",
            colon: "text-white/40",
            path: "text-cyan-300/80",
            dollar: "text-white/40",
            headline: "mt-2 text-white/75",
            summaryBox: "mt-6 rounded-xl border border-white/10 bg-black/30 p-4",
            summaryText: "text-sm leading-relaxed text-white/70",
            navBox: "rounded-xl border border-white/10 bg-black/40 backdrop-blur px-4 py-3",
            navText: "flex flex-wrap gap-3 text-sm font-mono text-white/65",
            navLink: "hover:text-white transition",
            card:
                "rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition",
            cardLink: "text-sm text-white/60 hover:text-white",
            body: "text-sm text-white/70",
            time: "text-xs text-white/60",
            tech:
                "rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs text-white/70",
            skill:
                "rounded-md border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-white/70 hover:bg-white/10 transition",
            bullet: "text-emerald-300/70",
        };

    const links = [
        p.website ? { label: "open website", href: p.website } : null,
        p.github ? { label: "open github", href: p.github } : null,
        p.linkedin ? { label: "open linkedin", href: p.linkedin } : null,
        p.email ? { label: "email me", href: `mailto:${p.email}` } : null,
        p.phone ? { label: "call me", href: `tel:${p.phone.replace(/\s+/g, "")}` } : null,
    ].filter(Boolean) as Array<{ label: string; href: string }>;

    const nav = [
        { id: "projects", label: "projects", show: d.projects.length > 0 },
        { id: "experience", label: "experience", show: d.experience.length > 0 },
        { id: "skills", label: "skills", show: d.skills.length > 0 },
        { id: "education", label: "education", show: d.education.length > 0 },
    ].filter((x) => x.show);

    return (
        <div className={ui.page}>
            <div className="mx-auto max-w-7xl px-6 py-12">
                {/* Terminal frame */}
                <div className={ui.frame}>
                    <div className={ui.topbar}>
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                        </div>
                        <div className={ui.title}>portfolio.sh</div>
                        <div className={ui.ver}>v1.0</div>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className={ui.prompt}>
                            <div>
                                <span className={ui.user}>user@site</span>
                                <span className={ui.colon}>:</span>
                                <span className={ui.path}>~</span>
                                <span className={ui.dollar}>$</span> whoami
                            </div>
                        </div>

                        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                            {p.fullName || "Your Name"}
                        </h1>

                        {p.headline ? (
                            <p className={ui.headline}>
                                <span className={isLight ? "text-black/45 font-mono" : "text-white/45 font-mono"}>$</span>{" "}
                                {p.headline}
                            </p>
                        ) : (
                            <p className={ui.headline}>
                                <span className={isLight ? "text-black/45 font-mono" : "text-white/45 font-mono"}>$</span>{" "}
                                Add a headline that describes what you do.
                            </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                            {p.location ? <Chip isLight={isLight}>{p.location}</Chip> : null}
                            {/* <Chip isLight={isLight}>single-page</Chip>
                            <Chip isLight={isLight}>fast</Chip>
                            <Chip isLight={isLight}>clean</Chip> */}
                        </div>

                        <div className={ui.summaryBox}>
                            <p className={ui.summaryText}>
                                {p.summary || "Add a short summary to introduce yourself."}
                            </p>
                        </div>

                        {links.length ? (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {links.map((l) => (
                                    <ExternalLink key={l.href} href={l.href} label={l.label} isLight={isLight} />
                                ))}
                            </div>
                        ) : null}

                        {nav.length ? (
                            <div className="mt-8 sticky top-4 z-10">
                                <div className={ui.navBox}>
                                    <div className={ui.navText}>
                                        {nav.map((n) => (
                                            <a key={n.id} href={`#${n.id}`} className={ui.navLink}>
                                                ./{n.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <div className="mt-10 space-y-14">
                            {d.projects.length ? (
                                <Section id="projects" title="Projects" isLight={isLight}>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {d.projects.map((pr, i) => (
                                            <article key={`${pr.name}-${i}`} className={ui.card}>
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="font-medium">{pr.name || "Untitled project"}</h3>
                                                    {pr.link ? (
                                                        <a href={pr.link} target="_blank" rel="noreferrer" className={ui.cardLink}>
                                                            ↗
                                                        </a>
                                                    ) : null}
                                                </div>

                                                {pr.description ? <p className={["mt-2", ui.body].join(" ")}>{pr.description}</p> : null}

                                                {pr.highlights.length ? (
                                                    <ul className={["mt-3 space-y-2", ui.body].join(" ")}>
                                                        {pr.highlights.slice(0, 4).map((h, idx) => (
                                                            <li key={idx}>
                                                                <span className={ui.bullet}>•</span>{" "}
                                                                {h}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : null}

                                                {pr.tech.length ? (
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {pr.tech.slice(0, 10).map((t) => (
                                                            <span key={t} className={ui.tech}>
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
                                <Section id="experience" title="Experience" isLight={isLight}>
                                    <div className="space-y-4">
                                        {d.experience.map((ex, i) => (
                                            <div key={`${ex.company}-${ex.role}-${i}`} className={ui.card}>
                                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                                    <div className="font-medium">{ex.role || "Role"}</div>
                                                    <div className={ui.time}>
                                                        {ex.start}
                                                        {ex.end ? ` — ${ex.end}` : ""}
                                                    </div>
                                                </div>
                                                <div className={["mt-1", ui.body].join(" ")}>
                                                    {ex.company || "Company"}
                                                    {ex.location ? ` • ${ex.location}` : ""}
                                                </div>

                                                {ex.highlights.length ? (
                                                    <ul className={["mt-3 list-disc pl-5 space-y-1", ui.body].join(" ")}>
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

                            {d.skills.length ? (
                                <Section id="skills" title="Skills" isLight={isLight}>
                                    <div className="flex flex-wrap gap-2">
                                        {d.skills.slice(0, 60).map((s) => (
                                            <span key={s} className={ui.skill}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </Section>
                            ) : null}

                            {d.education.length ? (
                                <Section id="education" title="Education" isLight={isLight}>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {d.education.map((ed, i) => (
                                            <div key={`${ed.school}-${i}`} className={ui.card}>
                                                <div className="font-medium">{ed.school || "School"}</div>
                                                <div className={["mt-1", ui.body].join(" ")}>
                                                    {ed.degree || "Degree"}
                                                </div>
                                                <div className={ui.time}>
                                                    {ed.start}
                                                    {ed.end ? ` — ${ed.end}` : ""}
                                                </div>
                                                {ed.notes ? (
                                                    <div className={["mt-3", ui.body].join(" ")}>
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
            </div>
        </div>
    );
}

export default function Page() {
    return <TemplateTerminal draft={defaultDraft} />;
}
