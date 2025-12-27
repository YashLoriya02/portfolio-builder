"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { loadDraft } from "@/lib/draft";
import type { PortfolioDraft, TemplateId } from "@/lib/draft";

import GlassTemplate from "@/app/dashboard/templates/glass/page";
import { TemplateMinimal } from "@/app/dashboard/templates/minimal/page";
import { TemplateNeo } from "@/app/dashboard/templates/neo/page";
import { TemplateClassic } from "@/app/dashboard/templates/classic/page";

const map: Record<TemplateId, (props: { draft: PortfolioDraft }) => JSX.Element> = {
    minimal: TemplateMinimal,
    neo: TemplateNeo,
    classic: TemplateClassic,
    glass: GlassTemplate,
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
                <div className="text-white/70 text-sm">Loading portfolio...</div>
            </div>
        );
    }

    return <Template draft={draft} />;
}
