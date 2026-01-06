"use client";

import type { PortfolioDraft, TemplateId } from "@/lib/draft";
import GlassTemplate from "@/app/dashboard/templates/glass/page";
import { TemplateMinimal } from "@/app/dashboard/templates/minimal/page";
import { TemplateNeo } from "@/app/dashboard/templates/neo/page";
import { TemplateClassic } from "@/app/dashboard/templates/classic/page";
import { TemplateEditorial } from "@/app/dashboard/templates/editorial/page";
import { TemplateAurora } from "@/app/dashboard/templates/aurora/page";
import { TemplateTerminal } from "@/app/dashboard/templates/terminal/page";
import { TemplateSpotlight } from "@/app/dashboard/templates/spotlight/page";
import { TemplateTimeline } from "@/app/dashboard/templates/timeline/page";
import { TemplateMuse } from "@/app/dashboard/templates/muse/page";
import { TemplateOrbit } from "@/app/dashboard/templates/orbit/page";
import { TemplatePaper } from "@/app/dashboard/templates/paper/page";

const map: Record<TemplateId, any> = {
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

export default function TemplatePreview({ draft }: { draft: PortfolioDraft }) {
  const T = map[draft.templateId] ?? GlassTemplate;
  return <T draft={draft} />;
}
