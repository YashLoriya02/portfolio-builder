import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type DeployBody = {
    projectName: string;
    repoOwner: string;
    repoName: string;
    production?: boolean;
};

const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

function vercelUrl(path: string) {
    const base = `https://api.vercel.com${path}`;
    return VERCEL_TEAM_ID ? `${base}?teamId=${VERCEL_TEAM_ID}` : base;
}

async function getGithubRepoId(owner: string, repo: string, GITHUB_TOKEN: string) {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`GITHUB_REPO_LOOKUP_FAILED: ${text}`);
    }

    const json = await res.json();
    return json.id as number;
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

export async function POST(req: Request) {
    try {
        if (!VERCEL_TOKEN) {
            return NextResponse.json(
                { error: "Missing VERCEL_TOKEN in environment" },
                { status: 500 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const token = (session as any).githubAccessToken as string | undefined;
        if (!token) {
            return NextResponse.json({ error: "Missing GitHub token. Sign out/in again." }, { status: 401 });
        }

        const body = (await req.json()) as DeployBody;
        const { projectName, repoOwner, repoName, production = true } = body;

        if (!projectName || !repoOwner || !repoName) {
            return NextResponse.json(
                { error: "projectName, repoOwner, repoName are required" },
                { status: 400 }
            );
        }

        // 1) Create / ensure Vercel project exists and is linked
        const createProjectRes = await fetch(vercelUrl("/v11/projects"), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${VERCEL_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: projectName,
                framework: "nextjs",
                gitRepository: {
                    type: "github",
                    repo: `${repoOwner}/${repoName}`,
                },
            }),
        });

        if (!createProjectRes.ok && createProjectRes.status !== 409) {
            const text = await createProjectRes.text();
            return NextResponse.json(
                { error: "VERCEL_CREATE_PROJECT_FAILED", details: text },
                { status: 400 }
            );
        }

        // 2) Get GitHub numeric repoId (required by Vercel gitSource)
        const repoId = await getGithubRepoId(repoOwner, repoName, token);

        // 3) Create deployment from git
        const deployRes = await fetch(vercelUrl("/v13/deployments"), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${VERCEL_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: projectName,
                project: projectName,
                target: production ? "production" : "preview",
                gitSource: {
                    type: "github",
                    repoId,      // ✅ REQUIRED
                    ref: "main", // adjust if needed
                },
            }),
        });

        if (!deployRes.ok) {
            const text = await deployRes.text();
            return NextResponse.json(
                { error: "VERCEL_DEPLOY_FAILED", details: text },
                { status: 400 }
            );
        }

        const deployJson = await deployRes.json();

        const deploymentId = deployJson.id;

        let baseUrl = await getDeploymentAlias(deploymentId);
        if (!baseUrl) {
            baseUrl = await getProjectVercelAppDomain(projectName);
        }

        const finalUrl = baseUrl ? `${baseUrl}/preview` : (deployJson.url ? `https://${deployJson.url}` : null);

        console.log("Final Url: ", finalUrl)

        return NextResponse.json({
            deploymentId: deployJson.id,
            url: finalUrl,
            status: deployJson.readyState ?? deployJson.status ?? "QUEUED",
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: "DEPLOY_UNEXPECTED_ERROR", details: String(err?.message || err) },
            { status: 500 }
        );
    }
}
