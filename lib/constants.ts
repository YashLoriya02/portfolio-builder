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
            id: "paper",
            name: "Paper",
            desc: "Ultra-clean, editorial layout. Minimal, ATS-friendly, and content focused.",
            tags: ["Minimal", "ATS-friendly", "Clean"],
        },
        {
            id: "timeline",
            name: "Timeline",
            desc: "Career journey laid out as a story. Experience-first, clear, and highly readable.",
            tags: ["Storytelling", "Experience", "Chronological", "Clean"],
        },
        {
            id: "minimal",
            name: "Minimal",
            desc: "No noise. Pure typography.",
            tags: ["Simple", "Fast", "ATS-friendly"],
        },
        {
            id: "orbit",
            name: "Orbit",
            desc: "High-wow visual layout with sections revolving around your core work.",
            tags: ["Interactive", "Unique", "Founder", "Showcase"],
        },
        {
            id: "neo",
            name: "Neo",
            desc: "Bold headings. Strong contrast.",
            tags: ["Impact", "Creator", "Modern"],
        },
        {
            id: "spotlight",
            name: "Spotlight",
            desc: "Big hero, featured projects, and bold storytelling. Built to impress at first glance.",
            tags: ["Premium", "Founder", "High Impact", "Modern"],
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
            id: "muse",
            name: "Muse",
            desc: "Aesthetic, magazine-style layout for creatives who care about craft and design.",
            tags: ["Creative", "Aesthetic", "Designer", "Premium"],
        },
    ];

export const LOADER_STEPS = [
    { t: "Checking your draft", d: "Making sure your portfolio has enough content…" },
    { t: "Preparing your template", d: "Bundling your selected template + config…" },
    { t: "Creating GitHub repository", d: "Generating a new repo from the template…" },
    { t: "Injecting your resume data", d: "Writing your draft.json into the repo…" },
    { t: "Finishing touches", d: "Almost done — getting your links ready…" },
];