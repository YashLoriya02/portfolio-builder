"use client";

import type { PortfolioDraft, TemplateId } from "@/lib/draft";
import GlassTemplate from "@/app/dashboard/templates/glass/page";
import { TemplateMinimal } from "@/app/dashboard/templates/minimal/page";
import { TemplateNeo } from "@/app/dashboard/templates/neo/page";
import { TemplateClassic } from "@/app/dashboard/templates/classic/page";

const map: Record<TemplateId, any> = {
  minimal: TemplateMinimal,
  neo: TemplateNeo,
  classic: TemplateClassic,
  glass: GlassTemplate,
};

export default function TemplatePreview({ draft }: { draft: PortfolioDraft }) {
  const T = map[draft.templateId] ?? GlassTemplate;
  return <T draft={draft} />;
}
