"use client";

import type { PortfolioDraft } from "@/lib/draft";
import TemplatePreview from "@/components/preview/TemplatePreview";

export default function LivePreview({ draft }: { draft: PortfolioDraft }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
            <TemplatePreview draft={draft} />
        </div>
    );
}
