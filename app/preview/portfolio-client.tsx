"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { loadDraft } from "@/lib/draft";
import type { PortfolioDraft, TemplateId } from "@/lib/draft";

import GlassTemplate from "@/app/dashboard/templates/glass/page";
import { TemplateMinimal } from "@/app/dashboard/templates/minimal/page";
import { TemplateNeo } from "@/app/dashboard/templates/neo/page";
import { TemplateClassic } from "@/app/dashboard/templates/classic/page";
import { TemplateEditorial } from "../dashboard/templates/editorial/page";
import { TemplateAurora } from "../dashboard/templates/aurora/page";
import { TemplateTerminal } from "../dashboard/templates/terminal/page";
import { TemplateSpotlight } from "../dashboard/templates/spotlight/page";
import { TemplateTimeline } from "../dashboard/templates/timeline/page";
import { TemplateMuse } from "../dashboard/templates/muse/page";
import { TemplateOrbit } from "../dashboard/templates/orbit/page";
import { TemplatePaper } from "../dashboard/templates/paper/page";

const map: Record<TemplateId, (props: { draft: PortfolioDraft }) => JSX.Element> = {
    minimal: TemplateMinimal,
    neo: TemplateNeo,
    classic: TemplateClassic,
    glass: GlassTemplate,
    editorial: TemplateEditorial,
    aurora: TemplateAurora,
    terminal: TemplateTerminal,
    spotlight: TemplateSpotlight,
    muse: TemplateMuse,
    paper: TemplatePaper,
    timeline: TemplateTimeline,
    orbit: TemplateOrbit,
};

export default function PortfolioClient() {
    const [draft, setDraft] = useState<PortfolioDraft | null>(null);

    useEffect(() => {
        setDraft(loadDraft());

        const onStorage = () => setDraft(loadDraft());
        window.addEventListener("storage", onStorage);

        const onDraft = () => setDraft(loadDraft());
        window.addEventListener("pb_draft_updated", onDraft as any);

        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("pb_draft_updated", onDraft as any);
        };
    }, []);

    const Template = useMemo(() => {
        const id = draft?.templateId ?? "glass";
        return map[id] ?? map.glass;
    }, [draft?.templateId]);

    if (!draft) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-white/70 tracking-wider animate-pulse text-4xl">Loading Portfolio...</div>
            </div>
        );
    }

    return <Template draft={draft} />;
}
