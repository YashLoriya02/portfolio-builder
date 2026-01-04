import { PortfolioDraft } from "@/lib/draft";

export function normalizeArray<T>(v: any): T[] {
    return Array.isArray(v) ? v : [];
}

export function normalizeString(v: any) {
    return typeof v === "string" ? v : "";
}

export function ensureHighlights(list: any): string[] {
    const arr = normalizeArray<string>(list).map(normalizeString).filter(Boolean);
    return arr.length ? arr : [""];
}

export function mapApiToDraftPatch(api: any): Partial<PortfolioDraft> {
    // supports both: { all: {...} } OR direct payload {...}
    const src = api?.all ?? api ?? {};
    const profile = src.profile ?? {};

    return {
        profile: {
            fullName: normalizeString(profile.fullName),
            headline: normalizeString(profile.headline),
            location: normalizeString(profile.location),
            email: normalizeString(profile.email),
            phone: normalizeString(profile.phone),
            website: normalizeString(profile.website),
            github: normalizeString(profile.github),
            linkedin: normalizeString(profile.linkedin),
            summary: normalizeString(profile.summary),
        },

        skills: normalizeArray<string>(src.skills).map(normalizeString).filter(Boolean),

        experience: normalizeArray<any>(src.experience).map((e) => ({
            company: normalizeString(e.company),
            role: normalizeString(e.role),
            start: normalizeString(e.start),
            end: normalizeString(e.end),
            location: normalizeString(e.location) || undefined,
            highlights: ensureHighlights(e.highlights),
        })),

        projects: normalizeArray<any>(src.projects).map((p) => ({
            name: normalizeString(p.name),
            link: normalizeString(p.link),
            tech: normalizeArray<string>(p.tech).map(normalizeString).filter(Boolean),
            description: normalizeString(p.description),
            highlights: ensureHighlights(p.highlights),
        })),

        education: normalizeArray<any>(src.education).map((ed) => ({
            school: normalizeString(ed.school),
            degree: normalizeString(ed.degree),
            start: normalizeString(ed.start),
            end: normalizeString(ed.end),
            notes: normalizeString(ed.notes) || undefined,
        })),

        // OPTIONAL: if your API provides responsibilities as array of objects or strings
        // we'll store it as a single string in draft.responsibilities
        responsibilities: Array.isArray(src.responsibilities)
            ? src.responsibilities
                .map((r: any) => normalizeString(r?.title || r?.org || r))
                .filter(Boolean)
                .join("\n")
            : normalizeString(src.responsibilities),
    };
}

export function applyDraftPatch(prev: PortfolioDraft, patch: Partial<PortfolioDraft>): PortfolioDraft {
    return {
        ...prev,
        ...patch,
        profile: { ...prev.profile, ...(patch.profile ?? {}) },
        // For lists: prefer patch if provided (even empty), else keep prev
        skills: patch.skills ?? prev.skills,
        experience: patch.experience ?? prev.experience,
        projects: patch.projects ?? prev.projects,
        education: patch.education ?? prev.education,
        responsibilities: patch.responsibilities ?? prev.responsibilities,
    };
}

export function SaveBadge({ state }: { state: "idle" | "saving" | "saved" | "error" }) {
    const map: Record<typeof state, { text: string; dot: string }> = {
        idle: { text: "All changes saved", dot: "bg-emerald-400" },
        saving: { text: "Saving…", dot: "bg-amber-400" },
        saved: { text: "Saved", dot: "bg-emerald-400" },
        error: { text: "Save failed", dot: "bg-rose-400" },
    };

    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <span className={`h-2 w-2 rounded-full ${map[state].dot}`} />
            <span className="text-xs text-white/70">{map[state].text}</span>
        </div>
    );
}

export function SectionCard({
    isResume,
    title,
    subtitle,
    children,
    right,
}: {
    isResume?: Boolean;
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className={`rounded-3xl border border-white/10 bg-white/4 p-6`}>
            <div className={`flex items-start justify-between gap-4 ${isResume ? "flex-col md:flex-row" : ""}`}>
                <div>
                    <div className="text-lg font-semibold">{title}</div>
                    {subtitle ? <div className="mt-1 text-sm text-white/60">{subtitle}</div> : null}
                </div>
                {right}
            </div>
            <div className="mt-5">{children}</div>
        </div>
    );
}

export function Input({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    return (
        <label className="block">
            <div className="text-xs text-white/60 mb-2">{label}</div>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none
                   focus:ring-2 focus:ring-white/10"
            />
        </label>
    );
}

export function Textarea({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    rows?: number;
}) {
    return (
        <label className="block">
            <div className="text-xs text-white/60 mb-2">{label}</div>
            <textarea
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none
                   focus:ring-2 focus:ring-white/10"
            />
        </label>
    );
}