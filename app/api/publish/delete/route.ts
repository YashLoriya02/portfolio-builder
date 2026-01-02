import { NextResponse } from "next/server";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

function vercelUrl(path: string) {
    const base = `https://api.vercel.com${path}`;
    return VERCEL_TEAM_ID ? `${base}?teamId=${VERCEL_TEAM_ID}` : base;
}

export async function POST(req: Request) {
    try {
        if (!VERCEL_TOKEN) {
            return NextResponse.json(
                { error: "Missing VERCEL_TOKEN in environment" },
                { status: 500 }
            );
        }

        const body = await req.json().catch(() => ({}));
        const projectName = body?.projectName as string;

        if (!projectName) {
            return NextResponse.json(
                { error: "projectName is required" },
                { status: 400 }
            );
        }

        // Deletes the Vercel project (also removes its deployments/domains under that project)
        const delRes = await fetch(vercelUrl(`/v9/projects/${encodeURIComponent(projectName)}`), {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${VERCEL_TOKEN}`,
            },
        });

        if (!delRes.ok && delRes.status !== 404) {
            const text = await delRes.text();
            return NextResponse.json(
                { error: "VERCEL_PROJECT_DELETE_FAILED", details: text },
                { status: 400 }
            );
        }

        return NextResponse.json({ ok: true, projectName });
    } catch (err: any) {
        return NextResponse.json(
            { error: "DELETE_UNEXPECTED_ERROR", details: String(err?.message || err) },
            { status: 500 }
        );
    }
}
