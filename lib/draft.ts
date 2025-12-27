export type TemplateId = "minimal" | "glass" | "neo" | "classic";

export type PortfolioDraft = {
    updatedAt: number;
    responsibilities: Array<string>,
    templateId: TemplateId;
    profile: {
        fullName: string;
        headline: string;
        location: string;
        email: string;
        phone: string;
        website: string;
        github: string;
        linkedin: string;
        summary: string;
    };
    experience: Array<{
        company: string;
        role: string;
        start: string;
        end: string;
        location?: string;
        highlights: string[];
    }>;
    projects: Array<{
        name: string;
        link: string;
        tech: string[];
        description: string;
        highlights: string[];
    }>;
    skills: string[];
    education: Array<{
        school: string;
        degree: string;
        start: string;
        end: string;
        notes?: string;
    }>;
};

export const DRAFT_KEY = "pb_draft_v1";

export const defaultDraft: PortfolioDraft = {
    updatedAt: Date.now(),
    responsibilities: [],
    templateId: "glass",
    profile: {
        fullName: "",
        headline: "",
        location: "",
        email: "",
        phone: "",
        website: "",
        github: "",
        linkedin: "",
        summary: "",
    },
    experience: [],
    projects: [],
    skills: [],
    education: [],
};

export function loadDraft(): PortfolioDraft {
    if (typeof window === "undefined") return defaultDraft;
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return defaultDraft;
        const parsed = JSON.parse(raw) as PortfolioDraft;
        return { ...defaultDraft, ...parsed, updatedAt: parsed.updatedAt || Date.now() };
    } catch {
        return defaultDraft;
    }
}

export function saveDraft(draft: PortfolioDraft) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, updatedAt: Date.now() }));
  window.dispatchEvent(new Event("pb_draft_updated"));
}
