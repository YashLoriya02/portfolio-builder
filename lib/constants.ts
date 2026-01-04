import { TemplateId } from "./draft";

export const templates: Array<{
    id: TemplateId;
    name: string;
    desc: string;
    tags: string[];
}> = [
        {
            id: "terminal",
            name: "Terminal",
            desc: "Developer terminal vibe. Monospace UI.",
            tags: ["Developer", "Monospace", "Geeky"],
        },
        {
            id: "aurora",
            name: "Aurora",
            desc: "Dark aurora glow. Premium modern feel.",
            tags: ["Premium", "Dark", "Interactive"],
        },
        {
            id: "minimal",
            name: "Minimal",
            desc: "No noise. Pure typography.",
            tags: ["Simple", "Fast", "ATS-friendly"],
        },
        {
            id: "editorial",
            name: "Editorial",
            desc: "Magazine-style layout. Premium typography.",
            tags: ["Elegant", "Typography", "Premium"],
        },
        {
            id: "classic",
            name: "Classic",
            desc: "Traditional layout. Recruiter-friendly.",
            tags: ["Formal", "Safe", "Professional"],
        },
        {
            id: "glass",
            name: "Glass",
            desc: "Modern dark glass UI. Product vibes.",
            tags: ["SaaS", "Dark", "Clean"],
        },
        {
            id: "neo",
            name: "Neo",
            desc: "Bold headings. Strong contrast.",
            tags: ["Impact", "Creator", "Modern"],
        },
    ];

export const LOADER_STEPS = [
    { t: "Checking your draft", d: "Making sure your portfolio has enough content…" },
    { t: "Preparing your template", d: "Bundling your selected template + config…" },
    { t: "Creating GitHub repository", d: "Generating a new repo from the template…" },
    { t: "Injecting your resume data", d: "Writing your draft.json into the repo…" },
    { t: "Finishing touches", d: "Almost done — getting your links ready…" },
];