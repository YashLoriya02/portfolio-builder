import type { PortfolioDraft } from "@/lib/draft";
import { normalizeDraft } from "@/lib/normalizeDraft";
import { defaultDraft } from "@/lib/draft";

function Pill({
  children,
  isLight,
}: {
  children: React.ReactNode;
  isLight: boolean;
}) {
  return (
    <span
      className={
        isLight
          ? "rounded-full border border-black/10 bg-black/3 px-3 py-1 text-xs text-black/70"
          : "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
      }
    >
      {children}
    </span>
  );
}

function CTA({
  href,
  label,
  primary,
  isLight,
}: {
  href: string;
  label: string;
  primary?: boolean;
  isLight: boolean;
}) {
  const isMail = href.startsWith("mailto:");
  const isTel = href.startsWith("tel:");

  const primaryCls = isLight
    ? "rounded-xl bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition"
    : "rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition";

  const secondaryCls = isLight
    ? "rounded-xl border border-black/10 bg-black/[0.03] px-4 py-2 text-sm text-black/80 hover:bg-black/[0.06] transition"
    : "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition";

  return (
    <a
      href={href}
      target={isMail || isTel ? undefined : "_blank"}
      rel={isMail || isTel ? undefined : "noreferrer"}
      className={primary ? primaryCls : secondaryCls}
    >
      {label}
    </a>
  );
}

export function TemplateNeo({ draft }: { draft: PortfolioDraft }) {
  const d = normalizeDraft(draft);
  const p = d.profile;

  const isLight = d.theme === "light";

  const ui = isLight
    ? {
        page: "min-h-screen bg-white text-black",
        hero: "rounded-3xl border border-black/10 bg-black/[0.03] p-8",
        heroMuted: "text-black/70",
        heroMuted2: "text-black/60",
        labelMuted: "text-black/50",
        card: "rounded-2xl border border-black/10 bg-black/[0.03] p-5 hover:bg-black/[0.05] transition",
        cardStatic: "rounded-2xl border border-black/10 bg-black/[0.03] p-5",
        rightPanel: "rounded-3xl border border-black/10 bg-black/[0.03] p-6",
        eduInner: "rounded-2xl border border-black/10 bg-black/[0.02] p-4",
        link: "text-sm text-black/60 hover:text-black",
        glowA: "bg-black/8",
        glowB: "bg-black/8",
      }
    : {
        page: "min-h-screen bg-black text-white",
        hero: "rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur",
        heroMuted: "text-white/70",
        heroMuted2: "text-white/60",
        labelMuted: "text-white/50",
        card: "rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/7 transition",
        cardStatic: "rounded-2xl border border-white/10 bg-white/5 p-5",
        rightPanel: "rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur",
        eduInner: "rounded-2xl border border-white/10 bg-black/30 p-4",
        link: "text-sm text-white/70 hover:text-white",
        glowA: "bg-white/10",
        glowB: "bg-white/10",
      };

  const links = [
    p.website ? { label: "Website", href: p.website } : null,
    p.github ? { label: "GitHub", href: p.github } : null,
    p.linkedin ? { label: "LinkedIn", href: p.linkedin } : null,
    p.email ? { label: "Email", href: `mailto:${p.email}` } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <div className={ui.page}>
      {/* glow */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className={`absolute -top-32 left-1/4 h-96 w-96 rounded-full blur-3xl ${ui.glowA}`} />
        <div className={`absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl ${ui.glowB}`} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        {/* Hero */}
        <div className={ui.hero}>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-5xl font-semibold tracking-tight">
                {p.fullName || "Your Name"}
              </div>

              {p.headline ? (
                <div className={["mt-3 text-lg", ui.heroMuted].join(" ")}>
                  {p.headline}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {p.location ? <Pill isLight={isLight}>{p.location}</Pill> : null}
                {p.email ? <Pill isLight={isLight}>{p.email}</Pill> : null}
              </div>
            </div>

            {links.length ? (
              <div className="flex flex-wrap gap-2">
                <CTA
                  href={links[0].href}
                  label={links[0].label}
                  primary
                  isLight={isLight}
                />
                {links.slice(1).map((l) => (
                  <CTA key={l.href} href={l.href} label={l.label} isLight={isLight} />
                ))}
              </div>
            ) : null}
          </div>

          <p className={["mt-6 max-w-3xl leading-relaxed", ui.heroMuted].join(" ")}>
            {p.summary ||
              "Add a summary. This area is meant to feel like a creator homepage intro."}
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Projects + Experience */}
          <div className="space-y-8">
            {d.projects.length ? (
              <section>
                <div className="flex items-end justify-between">
                  <h2 className="text-xl font-semibold">Projects</h2>
                  <div className={["text-sm", ui.labelMuted].join(" ")}>
                    Selected work
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {d.projects.map((pr, i) => (
                    <article key={`${pr.name}-${i}`} className={ui.card}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="font-medium">
                          {pr.name || "Untitled project"}
                        </div>
                        {pr.link ? (
                          <a
                            href={pr.link}
                            target="_blank"
                            rel="noreferrer"
                            className={ui.link}
                          >
                            ↗
                          </a>
                        ) : null}
                      </div>

                      {pr.description ? (
                        <p className={["mt-2 text-sm", ui.heroMuted].join(" ")}>
                          {pr.description}
                        </p>
                      ) : null}

                      {pr.highlights.length ? (
                        <ul
                          className={[
                            "mt-3 list-disc pl-5 text-sm space-y-1",
                            ui.heroMuted,
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
                            <Pill key={t} isLight={isLight}>
                              {t}
                            </Pill>
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
                      className={ui.cardStatic}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="font-medium">{ex.role || "Role"}</div>
                        <div className={["text-xs", ui.heroMuted2].join(" ")}>
                          {ex.start}
                          {ex.end ? ` — ${ex.end}` : ""}
                        </div>
                      </div>

                      <div className={["mt-1 text-sm", ui.heroMuted].join(" ")}>
                        {ex.company || "Company"}
                        {ex.location ? ` • ${ex.location}` : ""}
                      </div>

                      {ex.highlights.length ? (
                        <ul
                          className={[
                            "mt-3 list-disc pl-5 text-sm space-y-1",
                            ui.heroMuted,
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
              </section>
            ) : null}
          </div>

          {/* Skills + Education */}
          <div className="space-y-8">
            {d.skills.length ? (
              <section className={ui.rightPanel}>
                <h2 className="text-lg font-semibold">Skills</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {d.skills.slice(0, 60).map((s) => (
                    <Pill key={s} isLight={isLight}>
                      {s}
                    </Pill>
                  ))}
                </div>
              </section>
            ) : null}

            {d.education.length ? (
              <section className={ui.rightPanel}>
                <h2 className="text-lg font-semibold">Education</h2>
                <div className="mt-4 space-y-4">
                  {d.education.map((ed, i) => (
                    <div key={`${ed.school}-${i}`} className={ui.eduInner}>
                      <div className="font-medium">{ed.school || "School"}</div>
                      <div className={["mt-1 text-sm", ui.heroMuted].join(" ")}>
                        {ed.degree || "Degree"}
                      </div>
                      <div className={["mt-2 text-xs", ui.heroMuted2].join(" ")}>
                        {ed.start}
                        {ed.end ? ` — ${ed.end}` : ""}
                      </div>
                      {ed.notes ? (
                        <div className={["mt-3 text-sm", ui.heroMuted].join(" ")}>
                          {ed.notes}
                        </div>
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
