import { LOADER_STEPS } from "@/lib/constants";

export function SectionCard({
    isRepo,
    isDeploy,
    title,
    subtitle,
    right,
    children,
}: {
    isRepo?: Boolean;
    isDeploy?: Boolean;
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
            <div
                className={`flex ${isDeploy ? "flex-col" : ""} items-start justify-between gap-4 ${isRepo ? "flex-col md:flex-row" : ""}`}
            >
                <div>
                    <div className="text-lg font-semibold">{title}</div>
                    {subtitle ? (
                        <div className="mt-1 text-sm text-white/60">{subtitle}</div>
                    ) : null}
                </div>
                {right}
            </div>
            <div className="mt-5">{children}</div>
        </div>
    );
}

export function Input({
    label,
    value,
    onChange,
    placeholder,
    hint,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    hint?: string;
}) {
    return (
        <label className="block">
            <div className="text-xs text-white/60 mb-2">{label}</div>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none
                   focus:ring-2 focus:ring-white/10"
            />
            {hint ? <div className="mt-2 text-xs text-white/50">{hint}</div> : null}
        </label>
    );
}

export function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70">
            {children}
        </span>
    );
}

export function Spinner() {
    return (
        <div
            className="h-5 w-5 rounded-full border border-white/25 border-t-white/80 animate-spin"
            aria-hidden
        />
    );
}

export function PublishProgress({
    activeIndex,
    title,
    desc,
}: {
    activeIndex: number;
    title: string;
    desc: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-start gap-3">
                <Spinner />
                <div className="min-w-0">
                    <div className="text-sm font-medium">{title}</div>
                    <div className="mt-1 text-xs text-white/60">{desc}</div>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                {LOADER_STEPS.map((s, idx) => {
                    const done = idx < activeIndex;
                    const active = idx === activeIndex;
                    return (
                        <div key={s.t} className="flex items-center gap-3">
                            <div
                                className={[
                                    "h-2.5 w-2.5 rounded-full",
                                    done ? "bg-emerald-400" : active ? "bg-white" : "bg-white/20",
                                ].join(" ")}
                            />
                            <div className="text-xs text-white/70">{s.t}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}