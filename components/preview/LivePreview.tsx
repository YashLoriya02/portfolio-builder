// "use client";

// import type { PortfolioDraft } from "@/lib/draft";
// import TemplatePreview from "@/components/preview/TemplatePreview";

// export default function LivePreview({ draft }: { draft: PortfolioDraft }) {
//     return (
//         <div className="sticky top-22 h-[calc(100vh-110px)] overflow-y-auto rounded-3xl border border-white/10 bg-white/4">
//             <div className="border-b border-white/10 p-5">
//                 <div className="flex items-start justify-between gap-3">
//                     <div>
//                         <div className="text-xs text-white/60">Live Preview</div>
//                         <div className="mt-1 text-sm text-white/70">
//                             Template: <span className="text-white">{draft.templateId}</span>
//                         </div>
//                     </div>
//                     <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
//                         Auto updates
//                     </div>
//                 </div>
//             </div>

//             <div className="p-6">
//                 <TemplatePreview draft={draft} />
//             </div>
//         </div>
//     );
// }


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
