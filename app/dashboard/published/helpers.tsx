export async function deleteProject(selected: string): Promise<void> {
    const userId = localStorage.getItem("pb_user_id");

    try {
        await fetch(`/api/project/${userId}/${encodeURIComponent(selected)}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.log(e)
    }
}

export function shortUrl(u: string) {
    try {
        const url = new URL(u.startsWith("http") ? u : `https://${u}`);
        return `${url.host}${url.pathname}`.replace(/\/$/, "");
    } catch {
        return u;
    }
}

export function safeUrl(u: string) {
    const raw = (u || "").trim();
    if (!raw) return "";
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return `https://${raw}`;
}

export function providerFromUrl(url: string) {
    const u = safeUrl(url).toLowerCase();
    if (u.includes("vercel.app")) return "Vercel";
    if (u.includes("netlify.app")) return "Netlify";
    return "Live";
}

export function providerBadgeClass(provider: string) {
    if (provider === "Vercel") return "border-white/10 bg-white/5 text-white/80";
    if (provider === "Netlify") return "border-cyan-500/20 bg-cyan-500/10 text-cyan-200";
    return "border-white/10 bg-white/5 text-white/70";
}

export function timeAgo(iso: string) {
    const t = new Date(iso).getTime();
    const diff = Date.now() - t;

    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    if (day > 0) return `${day}d ago`;
    if (hr > 0) return `${hr}h ago`;
    if (min > 0) return `${min}m ago`;
    return "just now";
}
