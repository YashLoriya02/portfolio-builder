"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { defaultDraft, loadDraft, PortfolioDraft, saveDraft } from "@/lib/draft";

type SaveState = "idle" | "saving" | "saved" | "error";

export function useDraftAutosave() {
    const [draft, setDraft] = useState<PortfolioDraft>(() => loadDraft());
    const [saveState, setSaveState] = useState<SaveState>("idle");
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        setDraft(loadDraft());
    }, []);

    const api = useMemo(() => {
        function update(patch: Partial<PortfolioDraft>) {
            setDraft((prev) => ({ ...prev, ...patch }));
        }

        function flushSave(nextDraft?: PortfolioDraft) {
            try {
                setSaveState("saving");
                saveDraft(nextDraft ?? draft);
                setSaveState("saved");
                window.setTimeout(() => setSaveState("idle"), 900);
            } catch {
                setSaveState("error");
            }
        }

        function scheduleSave(nextDraft: PortfolioDraft) {
            if (timerRef.current) window.clearTimeout(timerRef.current);
            setSaveState("saving");
            timerRef.current = window.setTimeout(() => {
                flushSave(nextDraft);
            }, 600);
        }

        return { update, flushSave, scheduleSave };
    }, [draft]);

    useEffect(() => {
        api.scheduleSave(draft);
    }, [draft.updatedAt, draft.templateId, draft.profile, draft.experience, draft.projects, draft.skills, draft.education]);

    function setDraftSafe(updater: (prev: PortfolioDraft) => PortfolioDraft) {
        setDraft((prev) => {
            const next = updater(prev);
            return { ...next, updatedAt: Date.now() };
        });
    }

    function clearDraftSafe() {
        setDraft(defaultDraft);
    }

    return { draft, setDraftSafe, saveState, clearDraftSafe };
}
