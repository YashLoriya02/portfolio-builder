import { NextResponse } from "next/server";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

function vercelUrl(path: string) {
    const base = `https://api.vercel.com${path}`;
    return VERCEL_TEAM_ID ? `${base}?teamId=${VERCEL_TEAM_ID}` : base;
}

async function getDeploymentAlias(deploymentId: string) {
    const res = await fetch(vercelUrl(`/v2/deployments/${deploymentId}/aliases`), {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
        cache: "no-store",
    });

    if (!res.ok) return null;

    const aliases = await res.json();
    const list: string[] = Array.isArray(aliases)
        ? aliases.map((a: any) => (typeof a === "string" ? a : a?.alias || a?.domain)).filter(Boolean)
        : [];

    const preferred = list.find((a) => String(a).endsWith(".vercel.app"));
    return preferred ? `https://${preferred}` : list[0] ? `https://${list[0]}` : null;
}

async function getProjectVercelAppDomain(projectName: string) {
    const res = await fetch(vercelUrl(`/v9/projects/${projectName}/domains`), {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
        cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json().catch(() => null);

    const domains: string[] =
        json?.domains?.map((d: any) => d?.name).filter(Boolean) ?? [];

    const preferred = domains.find((d) => String(d).endsWith(".vercel.app"));
    return preferred ? `https://${preferred}` : null;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const projectName = searchParams.get("projectName");

    if (!id) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    if (!projectName) {
        return NextResponse.json({ error: "Missing projectName" }, { status: 400 });
    }

    const res = await fetch(vercelUrl(`/v13/deployments/${id}`), {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });

    if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: "STATUS_FAILED", details: text }, { status: 400 });
    }
    const deployJson = await res.json();
    const deploymentId = deployJson.id;

    let baseUrl = await getDeploymentAlias(deploymentId);
    if (!baseUrl) {
        baseUrl = await getProjectVercelAppDomain(projectName);
    }

    const finalUrl = baseUrl ? `${baseUrl}/preview` : (deployJson.url ? `https://${deployJson.url}` : null);

    return NextResponse.json({
        id: deployJson.id,
        url: finalUrl,
        state: deployJson.readyState,
        error: deployJson.error ?? null,
    });
}
