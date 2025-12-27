import type { PortfolioDraft } from "@/lib/draft";

const cleanStr = (v: unknown) => (typeof v === "string" ? v.trim() : "");

const cleanList = (arr: unknown) =>
    (Array.isArray(arr) ? arr : [])
        .map(cleanStr)
        .filter(Boolean);

const fixUrl = (u: string) => {
    const s = (u || "").trim();
    if (!s) return "";
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    // handle github.com/... style values
    return `https://${s}`;
};

export function normalizeDraft(draft: PortfolioDraft): PortfolioDraft {
    return {
        ...draft,
        profile: {
            ...draft.profile,
            website: fixUrl(draft.profile.website),
            github: fixUrl(draft.profile.github),
            linkedin: fixUrl(draft.profile.linkedin),
            email: cleanStr(draft.profile.email),
            phone: cleanStr(draft.profile.phone),
            fullName: cleanStr(draft.profile.fullName),
            headline: cleanStr(draft.profile.headline),
            location: cleanStr(draft.profile.location),
            summary: cleanStr(draft.profile.summary),
        },
        skills: cleanList(draft.skills),
        experience: (draft.experience || []).map((e) => ({
            ...e,
            company: cleanStr(e.company),
            role: cleanStr(e.role),
            start: cleanStr(e.start),
            end: cleanStr(e.end),
            location: cleanStr(e.location) || undefined,
            highlights: cleanList(e.highlights),
        })),
        projects: (draft.projects || []).map((p) => ({
            ...p,
            name: cleanStr(p.name),
            link: fixUrl(cleanStr(p.link)),
            tech: cleanList(p.tech),
            description: cleanStr(p.description),
            highlights: cleanList(p.highlights),
        })),
        education: (draft.education || []).map((ed) => ({
            ...ed,
            school: cleanStr(ed.school),
            degree: cleanStr(ed.degree),
            start: cleanStr(ed.start),
            end: cleanStr(ed.end),
            notes: cleanStr(ed.notes) || undefined,
        })),
    };
}
