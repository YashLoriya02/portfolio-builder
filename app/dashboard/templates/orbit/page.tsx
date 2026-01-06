"use client";

import type { PortfolioDraft } from "@/lib/draft";
import { normalizeDraft } from "@/lib/normalizeDraft";
import { defaultDraft } from "@/lib/draft";
import { BiGlobe } from "react-icons/bi";
import { LiaLinkedin } from "react-icons/lia";
import { TfiEmail } from "react-icons/tfi";
import { DiGithubBadge } from "react-icons/di";
import { Orbit, Phone } from "lucide-react";

function Chip({
    children,
    isLight,
}: {
    children: React.ReactNode;
    isLight: boolean;
}) {
    const cls = isLight
        ? "rounded-full border border-indigo-600/15 bg-indigo-600/10 px-3 py-1 text-xs text-indigo-900/80"
        : "rounded-full border border-indigo-300/15 bg-indigo-300/10 px-3 py-1 text-xs text-indigo-200/90";
    return <span className={cls}>{children}</span>;
}

function OrbButton({
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
        ? "inline-flex items-center gap-3 justify-center rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm text-black/80 hover:bg-black/[0.03] transition shadow-sm"
        : "inline-flex items-center gap-3 justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/80 hover:bg-white/10 transition";

    return (
        <a
            href={href}
            target={isMail || isTel || label === "Enter Orbit" ? undefined : "_blank"}
            rel={isMail || isTel ? undefined : "noreferrer"}
            className={cls}
        >
            <span className={isLight ? "text-black/70" : "text-white/80"}>
                {
                    label === "Website" ? (
                        <BiGlobe className="h-5 w-5" />
                    ) : label === "Enter Orbit" ? (
                        <Orbit className="h-5 w-5" />
                    ) : label === "Contact" ? (
                        <Phone className="h-4 w-4" />
                    ) : label === "GitHub" ? (
                        <DiGithubBadge className="h-5 w-5" />
                    ) : label === "LinkedIn" ? (
                        <LiaLinkedin className="h-5 w-5" />
                    ) : label === "Email" || label === "Email me" ? (
                        <TfiEmail className="h-4 w-5" />
                    ) : null
                }
            </span>

            <span className={isLight ? "text-black/80" : "text-white/85"}>{label}</span>
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

function OrbitCard({
    title,
    desc,
    tech,
    highlights,
    href,
    isLight,
}: {
    title: string;
    desc?: string;
    tech?: string[];
    highlights?: string[];
    href?: string | null;
    isLight: boolean;
}) {
    const card = isLight
        ? "group rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm hover:shadow-md transition"
        : "group rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition";

    const h3 = isLight
        ? "text-base font-semibold tracking-tight text-black"
        : "text-base font-semibold tracking-tight text-white";

    const body = isLight ? "text-sm text-black/70" : "text-sm text-white/70";
    const dim = isLight ? "text-black/55" : "text-white/55";

    const pill = isLight
        ? "rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-black/75"
        : "rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/75";

    const open = isLight
        ? "rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-black/70 hover:bg-black/[0.03] transition"
        : "rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 hover:bg-white/10 transition";

    return (
        <article className={card}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className={h3}>{title}</div>
                    {desc ? <div className={["mt-2", body].join(" ")}>{desc}</div> : null}
                </div>

                {href ? (
                    <a href={href} target="_blank" rel="noreferrer" className={open} aria-label="Open">
                        ↗
                    </a>
                ) : null}
            </div>

            {highlights && highlights.length ? (
                <ul className={["mt-4 space-y-2", body].join(" ")}>
                    {highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex gap-2">
                            <span className={isLight ? "text-indigo-700/70" : "text-indigo-300/70"}>
                                •
                            </span>
                            <span>{h}</span>
                        </li>
                    ))}
                </ul>
            ) : null}

            {tech && tech.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                    {tech.slice(0, 10).map((t) => (
                        <span key={t} className={pill}>
                            {t}
                        </span>
                    ))}
                </div>
            ) : null}

            <div className={["mt-5 text-xs", dim].join(" ")}>
                Signal:{" "}
                <span className={isLight ? "text-indigo-700/80" : "text-indigo-300/80"}>
                    orbit
                </span>
            </div>
        </article>
    );
}

function Orb({
    label,
    sub,
    size,
    isLight,
}: {
    label: string;
    sub?: string;
    size: "sm" | "md" | "lg";
    isLight: boolean;
}) {
    const base =
        "relative grid place-items-center rounded-full border backdrop-blur-xl select-none";
    const ring = isLight ? "border-black/10" : "border-white/10";

    const bg =
        isLight
            ? "bg-white/70 shadow-[0_0_0_1px_rgba(0,0,0,0.03)]"
            : "bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]";

    const s =
        size === "lg"
            ? "h-44 w-44 md:h-56 md:w-56"
            : size === "md"
                ? "h-28 w-28 md:h-32 md:w-32"
                : "h-20 w-20 md:h-24 md:w-24";

    const title = isLight ? "text-sm font-semibold text-black/80" : "text-sm font-semibold text-white/80";
    const subtitle = isLight ? "mt-1 text-[11px] text-black/55" : "mt-1 text-[11px] text-white/55";

    const glow = isLight
        ? "before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.12),transparent_55%)] before:opacity-100 before:content-['']"
        : "before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.28),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.18),transparent_55%)] before:opacity-100 before:content-['']";

    return (
        <div className={`${base} ${ring} ${bg} ${s} ${glow}`}>
            <div className="relative text-center px-3">
                <div className={title}>{label}</div>
                {sub ? <div className={subtitle}>{sub}</div> : null}
            </div>
        </div>
    );
}

export function TemplateOrbit({ draft }: { draft: PortfolioDraft }) {
    const d = normalizeDraft(draft);
    const p = d.profile;
    const isLight = d.theme === "light";

    const ui = isLight
        ? {
            page: "min-h-screen bg-[#fbfbfd] text-black",
            shell: "mx-auto max-w-7xl px-6 py-12",
            hero:
                "relative overflow-hidden rounded-[2.25rem] bxsd-light backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)]",
            heroInner: "px-6 py-12 md:px-10 md:py-16",
            name: "text-4xl md:text-6xl font-semibold tracking-tight",
            headline: "mt-4 text-lg md:text-xl text-black/70",
            summary: "mt-6 max-w-3xl text-sm md:text-base leading-relaxed text-black/65",
            actions: "mt-8 flex flex-wrap gap-2",
            metaRow: "mt-6 flex flex-wrap gap-2",
            main: "mt-10 grid gap-8 lg:grid-cols-[1fr_420px]",
            orbitBox:
                "rounded-[2.25rem] border border-black/10 bg-white/70 backdrop-blur p-6 shadow-sm",
            orbitTitle: "text-sm font-semibold tracking-[0.18em] uppercase text-black/70",
            orbitHint: "mt-2 text-sm text-black/60",
            orbitStage:
                "relative mt-6 grid place-items-center rounded-3xl border border-black/10 bg-white/60 p-6 overflow-hidden",
            orbitLine:
                "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.10),transparent_60%)]",
            orbitRing:
                "pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10",
            orbitRing2:
                "pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10",
            orbitRing3:
                "pointer-events-none absolute left-1/2 top-1/2 h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10",
            mainCol: "space-y-16",
            footer:
                "mt-12 rounded-[2.25rem] border border-black/10 bg-white/70 backdrop-blur p-8 md:p-10 shadow-sm",
            footerTitle: "text-2xl md:text-3xl font-semibold tracking-tight",
            footerText: "mt-2 text-sm md:text-base text-black/65",
        }
        : {
            page: "min-h-screen bg-[#07070B] text-white",
            shell: "mx-auto max-w-7xl px-6 py-12",
            hero:
                "relative overflow-hidden rounded-[2.25rem] bxsd bg-[#1111174f] backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)]",
            heroInner: "px-6 py-12 md:px-10 md:py-16",
            name: "text-4xl md:text-6xl font-semibold tracking-tight",
            headline: "mt-4 text-lg md:text-xl text-white/75",
            summary: "mt-6 max-w-3xl text-sm md:text-base leading-relaxed text-white/70",
            actions: "mt-8 flex flex-wrap gap-2",
            metaRow: "mt-6 flex flex-wrap gap-2",
            main: "mt-10 grid gap-8 lg:grid-cols-[1fr_420px]",
            orbitBox:
                "rounded-[2.25rem] border border-white/10 bg-black/40 backdrop-blur p-6",
            orbitTitle: "text-sm font-semibold tracking-[0.18em] uppercase text-white/70",
            orbitHint: "mt-2 text-sm text-white/65",
            orbitStage:
                "relative mt-6 grid place-items-center rounded-3xl border border-white/10 bg-white/5 p-6 overflow-hidden",
            orbitLine:
                "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.20),transparent_60%)]",
            orbitRing:
                "pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10",
            orbitRing2:
                "pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10",
            orbitRing3:
                "pointer-events-none absolute left-1/2 top-1/2 h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10",
            mainCol: "space-y-16",
            footer:
                "mt-12 rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur p-8 md:p-10",
            footerTitle: "text-2xl md:text-3xl font-semibold tracking-tight",
            footerText: "mt-2 text-sm md:text-base text-white/70",
        };

    const links = [
        p.website ? { label: "Website", href: p.website } : null,
        p.github ? { label: "GitHub", href: p.github } : null,
        p.linkedin ? { label: "LinkedIn", href: p.linkedin } : null,
        p.email ? { label: "Email", href: `mailto:${p.email}` } : null,
        p.phone ? { label: "Call", href: `tel:${p.phone.replace(/\s+/g, "")}` } : null,
    ].filter(Boolean) as Array<{ label: string; href: string }>;

    const orbitItems = [
        {
            label: "Projects",
            sub: d.projects.length ? `${d.projects.length} shipped` : "add work",
            size: "lg" as const,
        },
        {
            label: "Skills",
            sub: d.skills.length ? `${d.skills.length} tools` : "add stack",
            size: "md" as const,
        },
        {
            label: "Experience",
            sub: d.experience.length ? `${d.experience.length} roles` : "add roles",
            size: "md" as const,
        },
        {
            label: "Education",
            sub: d.education.length ? `${d.education.length} entries` : "optional",
            size: "sm" as const,
        },
    ];

    return (
        <div className={ui.page}>
            <div className={ui.shell}>
                {/* Hero */}
                <div className={`${ui.hero}`}>
                    <div className={ui.heroInner}>
                        <h1 className={ui.name}>{p.fullName || "Your Name"}</h1>
                        <p className={ui.headline}>
                            {p.headline ||
                                "Orbit is a high-wow portfolio: a central signal with sections orbiting around it."}
                        </p>

                        <div className={ui.metaRow}>
                            {p.location ? <Chip isLight={isLight}>{p.location}</Chip> : null}
                            {d.projects.length ? <Chip isLight={isLight}>{d.projects.length} projects</Chip> : null}
                            {d.skills.length ? <Chip isLight={isLight}>{d.skills.length} skills</Chip> : null}
                        </div>

                        <p className={ui.summary}>
                            {p.summary ||
                                "A premium, interactive-feeling layout without heavy JS. Great for founders and builders who want a distinctive, modern portfolio."}
                        </p>

                        <div className={ui.actions}>
                            <OrbButton href="#orbit-map" label="Enter Orbit" isLight={isLight} />
                            {p.email ? (
                                <OrbButton href={`mailto:${p.email}`} label="Contact" isLight={isLight} />
                            ) : null}
                            {links.slice(0, 2).map((l) => (
                                <OrbButton key={l.href} href={l.href} label={l.label} isLight={isLight} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className={ui.main}>
                    {/* Main content */}
                    <div className={ui.mainCol}>
                        {d.projects.length ? (
                            <Section
                                id="projects"
                                title="Projects"
                                subtitle="The strongest proof of work. Keep it tight, keep it sharp."
                                isLight={isLight}
                            >
                                <div className="grid gap-4 md:grid-cols-2">
                                    {d.projects.slice(0, 8).map((pr, i) => (
                                        <OrbitCard
                                            key={`${pr.name}-${i}`}
                                            title={pr.name || "Untitled project"}
                                            desc={pr.description || undefined}
                                            highlights={pr.highlights || undefined}
                                            tech={pr.tech || undefined}
                                            href={pr.link || null}
                                            isLight={isLight}
                                        />
                                    ))}
                                </div>
                            </Section>
                        ) : null}

                        {d.experience.length ? (
                            <Section
                                id="experience"
                                title="Experience"
                                subtitle="Roles where I owned outcomes and shipped."
                                isLight={isLight}
                            >
                                <div className="grid gap-4">
                                    {d.experience.slice(0, 6).map((ex, i) => (
                                        <OrbitCard
                                            key={`${ex.company}-${ex.role}-${i}`}
                                            title={`${ex.role || "Role"} · ${ex.company || "Company"}`}
                                            desc={`${ex.start || ""}${ex.end ? ` — ${ex.end}` : ""}${ex.location ? ` • ${ex.location}` : ""
                                                }`}
                                            highlights={ex.highlights || undefined}
                                            tech={[]}
                                            href={null}
                                            isLight={isLight}
                                        />
                                    ))}
                                </div>
                            </Section>
                        ) : null}

                        {d.skills.length ? (
                            <Section
                                id="skills"
                                title="Skills"
                                subtitle="Tools and technologies I use to build reliably."
                                isLight={isLight}
                            >
                                <div className="flex flex-wrap gap-2">
                                    {d.skills.slice(0, 72).map((s) => (
                                        <Chip key={s} isLight={isLight}>
                                            {s}
                                        </Chip>
                                    ))}
                                </div>
                            </Section>
                        ) : null}

                        {d.education.length ? (
                            <Section
                                id="education"
                                title="Education"
                                subtitle="Foundations behind the work."
                                isLight={isLight}
                            >
                                <div className="grid gap-4 md:grid-cols-2">
                                    {d.education.map((ed, i) => (
                                        <OrbitCard
                                            key={`${ed.school}-${i}`}
                                            title={ed.school || "School"}
                                            desc={`${ed.degree || "Degree"} · ${ed.start || ""}${ed.end ? ` — ${ed.end}` : ""
                                                }`}
                                            highlights={ed.notes ? [ed.notes] : []}
                                            tech={[]}
                                            href={null}
                                            isLight={isLight}
                                        />
                                    ))}
                                </div>
                            </Section>
                        ) : null}

                        {/* Footer */}
                        <div className={ui.footer}>
                            <div className={ui.footerTitle}>Ready to collaborate?</div>
                            <div className={ui.footerText}>
                                If you want to ship something ambitious, let’s talk.
                            </div>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {p.email ? (
                                    <OrbButton href={`mailto:${p.email}`} label="Email me" isLight={isLight} />
                                ) : (
                                    <OrbButton href="#projects" label="View projects" isLight={isLight} />
                                )}
                                {p.linkedin ? (
                                    <OrbButton href={p.linkedin} label="LinkedIn" isLight={isLight} />
                                ) : null}
                                {p.github ? <OrbButton href={p.github} label="GitHub" isLight={isLight} /> : null}
                                {p.website ? (
                                    <OrbButton href={p.website} label="Website" isLight={isLight} />
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Orbit panel */}
                    <aside id="orbit-map" className={ui.orbitBox}>
                        <div className={ui.orbitTitle}>Orbit Map</div>
                        <div className={ui.orbitHint}>
                            A visual overview. The center is your work. Everything else revolves around it.
                        </div>

                        <div className={ui.orbitStage}>
                            <div className={ui.orbitLine} />
                            <div className={ui.orbitRing} />
                            <div className={ui.orbitRing2} />
                            <div className={ui.orbitRing3} />

                            {/* Layout: center + 3 around */}
                            <div className="relative grid place-items-center">
                                <Orb
                                    label={orbitItems[0].label}
                                    sub={orbitItems[0].sub}
                                    size="lg"
                                    isLight={isLight}
                                />

                                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                                    <Orb
                                        label={orbitItems[1].label}
                                        sub={orbitItems[1].sub}
                                        size="md"
                                        isLight={isLight}
                                    />
                                </div>

                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                                    <Orb
                                        label={orbitItems[2].label}
                                        sub={orbitItems[2].sub}
                                        size="md"
                                        isLight={isLight}
                                    />
                                </div>

                                <div className="absolute left-1/2 top-1/2 -translate-x-[170%] -translate-y-1/2">
                                    <Orb
                                        label={orbitItems[3].label}
                                        sub={orbitItems[3].sub}
                                        size="sm"
                                        isLight={isLight}
                                    />
                                </div>

                                <div className="absolute left-1/2 top-1/2 translate-x-[70%] -translate-y-1/2 hidden md:block">
                                    <Orb
                                        label={p.location ? "Location" : "Links"}
                                        sub={p.location || (links[0]?.label ?? "add links")}
                                        size="sm"
                                        isLight={isLight}
                                    />
                                </div>
                            </div>
                        </div>

                        {links.length ? (
                            <div className="mt-6">
                                <div
                                    className={
                                        isLight
                                            ? "text-xs uppercase tracking-[0.18em] text-black/55"
                                            : "text-xs uppercase tracking-[0.18em] text-white/50"
                                    }
                                >
                                    Quick Links
                                </div>
                                <div className="mt-3 flex flex-col flex-wrap gap-2">
                                    {links.slice(0, 4).map((l) => (
                                        <OrbButton key={l.href} href={l.href} label={l.label} isLight={isLight} />
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    return <TemplateOrbit draft={defaultDraft} />;
}
