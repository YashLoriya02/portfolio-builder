"use client";

import { useMemo, useState } from "react";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import type { TemplateId } from "@/lib/draft";
import TemplatePreview from "@/components/preview/TemplatePreview";

const templates: Array<{
    id: TemplateId;
    name: string;
    desc: string;
    tags: string[];
}> = [
        { id: "glass", name: "Glass", desc: "Modern dark glass UI. Product vibes.", tags: ["SaaS", "Dark", "Clean"] },
        { id: "minimal", name: "Minimal", desc: "No noise. Pure typography.", tags: ["Simple", "Fast", "ATS-friendly"] },
        { id: "neo", name: "Neo", desc: "Bold headings. Strong contrast.", tags: ["Impact", "Creator"] },
        { id: "classic", name: "Classic", desc: "Traditional layout. Recruiter-friendly.", tags: ["Formal", "Safe"] },
    ];

function Tag({ t }: { t: string }) {
    return (
        <span className="text-[11px] rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/70">
            {t}
        </span>
    );
}

function Modal({
    open,
    onClose,
    children,
}: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-9999">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl">
                    {children}
                </div>
            </div>
        </div>
    );
}

function TemplateThumb({
    draft,
    templateId,
}: {
    draft: any;
    templateId: TemplateId;
}) {
    const scale = 0.38;

    return (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
            <div className="h-52 relative">
                <div className="absolute inset-0 bg-linear-to-b from-white/6 to-transparent" />

                <div
                    className="absolute rounded-2xl border p-2 border-white top-3 left-3 origin-top-left pointer-events-none select-none"
                    style={{ transform: `scale(${scale})` }}
                >
                    <div className="w-200">
                        <TemplatePreview draft={{ ...draft, templateId }} />
                    </div>
                </div>
            </div>

            <div className="pointer-events-none h-10 bg-linear-to-t from-black/60 to-transparent" />
        </div>
    );
}


export default function TemplatesPage() {
    const { draft, setDraftSafe } = useDraftAutosave();
    const [preview, setPreview] = useState<TemplateId | null>(null);

    const selected = draft.templateId;

    const selectedMeta = useMemo(() => templates.find((t) => t.id === selected), [selected]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
                <p className="mt-1 text-sm text-white/60">
                    Pick a style. You can switch anytime — content stays.
                </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-sm text-white/60">Selected</div>
                        <div className="mt-1 text-lg font-semibold">{selectedMeta?.name ?? selected}</div>
                        <div className="mt-1 text-sm text-white/70">{selectedMeta?.desc}</div>
                    </div>

                    <button
                        onClick={() => setPreview(selected)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                    >
                        Preview
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {templates.map((t) => {
                    const isSelected = t.id === selected;
                    return (
                        <div
                            key={t.id}
                            className="rounded-3xl border border-white/10 bg-white/4 p-5 hover:bg-white/6 transition"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-lg font-semibold">{t.name}</div>
                                    <div className="mt-1 text-sm text-white/70">{t.desc}</div>
                                </div>
                                {isSelected ? (
                                    <span className="text-xs rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-500/20 px-2 py-1">
                                        Selected
                                    </span>
                                ) : null}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {t.tags.map((x) => (
                                    <Tag key={x} t={x} />
                                ))}
                            </div>

                            <TemplateThumb draft={draft} templateId={t.id} />

                            <div className="mt-5 flex gap-2">
                                <button
                                    onClick={() => setPreview(t.id)}
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={() => {
                                        setDraftSafe((p) => ({ ...p, templateId: t.id }));
                                    }}
                                    className="flex-1 rounded-xl bg-white text-black px-3 py-2 text-sm font-medium hover:opacity-90 transition active:scale-[0.99]"
                                >
                                    Use
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal open={preview !== null} onClose={() => setPreview(null)}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div>
                        <div className="text-sm text-white/60">Preview</div>
                        <div className="text-lg font-semibold">
                            {preview ? templates.find((t) => t.id === preview)?.name : ""}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {preview ? (
                            <button
                                onClick={() => {
                                    setDraftSafe((p) => ({ ...p, templateId: preview }));
                                    setPreview(null);
                                }}
                                className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 transition"
                            >
                                Select
                            </button>
                        ) : null}

                        <button
                            onClick={() => setPreview(null)}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
                        <TemplatePreview draft={{ ...draft, templateId: preview ?? draft.templateId }} />
                    </div>
                </div>
            </Modal>

        </div>
    );
}
