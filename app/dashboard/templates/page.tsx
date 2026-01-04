"use client";

import { useMemo, useState } from "react";
import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import type { TemplateId, ThemeMode } from "@/lib/draft";
import TemplatePreview from "@/components/preview/TemplatePreview";
import Link from "next/link";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import { Moon, Sun } from "lucide-react";
import { templates } from "@/lib/constants";

function ThemeToggle({
    value,
    onChange,
}: {
    value: ThemeMode;
    onChange: (v: ThemeMode) => void;
}) {
    const isDark = value === "dark";

    return (
        <div className="relative inline-flex items-center rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur">
            <div
                className={[
                    "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-white transition-transform duration-300 ease-out",
                    isDark ? "translate-x-0" : "translate-x-[calc(100%+4px)]",
                ].join(" ")}
            />

            <button
                type="button"
                onClick={() => onChange("dark")}
                className={[
                    "relative z-10 flex items-center gap-2 px-3 py-1.5 text-sm rounded-xl transition",
                    isDark
                        ? "text-black"
                        : "text-white/70 hover:text-white hover:bg-white/10",
                ].join(" ")}
                aria-pressed={isDark}
            >
                <Moon className="h-5 w-5" />
                <span className="hidden sm:inline">Dark</span>
            </button>

            <button
                type="button"
                onClick={() => onChange("light")}
                className={[
                    "relative z-10 flex items-center gap-2 px-3 py-1.5 text-sm rounded-xl transition",
                    !isDark
                        ? "text-black"
                        : "text-white/70 hover:text-white hover:bg-white/10",
                ].join(" ")}
                aria-pressed={!isDark}
            >
                <Sun className="h-5 w-5" />
                <span className="hidden sm:inline">Light</span>
            </button>
        </div>
    );
}

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
            <div
                className="absolute inset-0 backdrop-blur-sm bg-black/10"
                onClick={onClose}
            />

            <div className="absolute inset-0 flex items-center justify-center p-4 no-scrollbar">
                <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden no-scrollbar overflow-y-auto rounded-3xl border border-white/25 bg-black/80 backdrop-blur-xl">
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
                    className={`absolute rounded-2xl border p-2 ${draft.theme === "light" ? "border-black" : "border-white"} top-3 left-3 origin-top-left pointer-events-none select-none`}
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
    const { draft, setDraftSafe, clearDraftSafe } = useDraftAutosave();
    useDynamicTitle(draft.profile.fullName);

    const [preview, setPreview] = useState<TemplateId | null>(null);

    const selected = draft.templateId;

    // NEW: theme
    const theme = (draft as any).theme === "light" ? "light" : "dark";

    const selectedMeta = useMemo(
        () => templates.find((t) => t.id === selected),
        [selected]
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:gap-0 md:flex-row justify-between md:items-center">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
                    <p className="mt-1 ml-1 text-sm text-white/60">
                        Pick a style. You can switch anytime — content stays.
                    </p>
                </div>

                <div className="flex gap-3 flex-wrap items-center">
                    <ThemeToggle
                        value={theme}
                        onChange={(v) => setDraftSafe((p) => ({ ...p, theme: v }))}
                    />

                    <Link
                        href="/dashboard/publish"
                        className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm hover:bg-white/10 transition"
                    >
                        Publish Now
                    </Link>

                    <button
                        onClick={clearDraftSafe}
                        className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm hover:bg-white/10 transition"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-lg font-normal text-white/60">
                            Selected Template -
                            <span className="font-semibold">{" "}{selectedMeta?.name ?? selected}</span>
                        </div>
                        <div className="mt-1 text-sm text-white/70">{selectedMeta?.desc}</div>

                        {/* NEW: small theme hint */}
                        <div className="mt-2 text-xs text-white/50">
                            Theme: <span className="text-white/70">{theme}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setPreview(selected)}
                        className="hidden md:block rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition"
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

                            {/* IMPORTANT: thumb must carry theme too */}
                            <TemplateThumb draft={{ ...draft, theme }} templateId={t.id} />

                            <div className="mt-5 flex gap-2">
                                <button
                                    onClick={() => setPreview(t.id)}
                                    className="hidden md:block flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
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
                        <div className="mt-1 text-xs text-white/50">
                            Theme: <span className="text-white/70">{theme}</span>
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

                <div className="py-3 px-6">
                    <div className="rounded-3xl no-scrollbar border border-white/10 bg-black/40 px-4">
                        {/* IMPORTANT: preview must carry theme too */}
                        <TemplatePreview
                            draft={{ ...draft, theme, templateId: preview ?? draft.templateId }}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
