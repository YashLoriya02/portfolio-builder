"use client"

import { useDraftAutosave } from "@/hooks/useDraftAutosave";
import { useDynamicTitle } from "@/hooks/useDynamicTitle";
import Link from "next/link";

const stats = [
  { label: "Profile completion", value: "12%", sub: "Add resume to auto-fill", pill: "Low" },
  { label: "Templates picked", value: "0", sub: "Choose a style", pill: "Pending" },
  { label: "Projects added", value: "0", sub: "Show your best work", pill: "Next" },
  // { label: "Publish status", value: "Draft", sub: "Not live yet", pill: "Draft" },
];

const steps = [
  { title: "Upload your resume", desc: "Auto-extract experience, skills & projects.", href: "/dashboard/editor" },
  { title: "Pick a template", desc: "Choose a clean layout and preview instantly.", href: "/dashboard/templates" },
  { title: "Publish your link", desc: "Go live and share it with recruiters.", href: "/dashboard/publish" },
];

const activity = [
  { title: "Signed in with GitHub", time: "Just now" },
];

function Pill({ text }: { text: string }) {
  return (
    <span className="text-xs rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/70">
      {text}
    </span>
  );
}

export default function DashboardPage() {
  const { draft } = useDraftAutosave();

  useDynamicTitle(draft.profile.fullName);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/4 p-6">
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Build a portfolio that looks like a product.
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/70 max-w-2xl">
            Start from your resume, fine-tune the story, pick a template, and publish a shareable link in minutes.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/editor"
              className="inline-flex items-center justify-center rounded-xl bg-white text-black px-4 py-2 font-medium
                         hover:opacity-90 transition active:scale-[0.99]"
            >
              Start with Resume
            </Link>
            <Link
              href="/dashboard/templates"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2
                         hover:bg-white/10 transition active:scale-[0.99]"
            >
              Explore Templates
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-white/4 p-5 hover:bg-white/6 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm text-white/70">{s.label}</div>
              <Pill text={s.pill} />
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">{s.value}</div>
            <div className="mt-1 text-xs text-white/60">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Next steps</h2>
            <span className="text-xs text-white/60">Finish these to publish</span>
          </div>

          <div className="mt-5 space-y-3">
            {steps.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group block rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-sm text-white/70 mt-1">{s.desc}</div>
                  </div>
                  <div className="text-white/60 group-hover:text-white transition">→</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
          <h2 className="text-lg font-semibold">Activity</h2>
          <div className="mt-4 space-y-3">
            {activity.map((a, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="text-sm font-medium">{a.title}</div>
                <div className="mt-1 text-xs text-white/60">{a.time}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-sm font-medium">Pro tip</div>
            <div className="mt-1 text-xs text-white/70">
              Add 2-3 strong projects with metrics. Recruiters skim — numbers pop.
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
