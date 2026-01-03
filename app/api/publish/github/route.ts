import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { PortfolioDraft } from "@/lib/draft";
import { Project } from "@/models/Project";
import { connectDB } from "@/lib/mongodb";

export const runtime = "nodejs";

function json(data: any, status = 200) {
    return NextResponse.json(data, { status });
}

function ghPath(p: string) {
    return p.split("/").map(encodeURIComponent).join("/");
}

async function ghText(token: string, url: string, init?: RequestInit) {
    const res = await fetch(url, {
        ...init,
        headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
            ...(init?.headers || {}),
        },
        cache: "no-store",
    });

    const text = await res.text().catch(() => "");
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${text}`);
    return text;
}

async function gh<T>(token: string, url: string, init?: RequestInit): Promise<T> {
    const text = await ghText(token, url, init);
    return (text ? (JSON.parse(text) as T) : ({} as T));
}

function sanitizeRepoName(name: string) {
    return (name || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
}

async function waitForRepoReady(token: string, owner: string, repo: string) {
    const delays = [300, 500, 800, 1200, 1600, 2000, 2500];

    for (const ms of delays) {
        try {
            const meta = await gh<{ default_branch: string }>(
                token,
                `https://api.github.com/repos/${owner}/${repo}`
            );

            const branch = meta.default_branch || "main";

            await gh<any>(
                token,
                `https://api.github.com/repos/${owner}/${repo}/contents?ref=${encodeURIComponent(branch)}`
            );

            return branch;
        } catch (e: any) {
            const msg = String(e?.message || "");
            if (
                msg.includes("This repository is empty") ||
                msg.includes('"status":"404"') ||
                msg.includes("Not Found")
            ) {
                await new Promise((r) => setTimeout(r, ms));
                continue;
            }
            throw e;
        }
    }

    throw new Error("Template repo generation is taking too long. Please retry.");
}

const saveGithubProjectToDB = async (params: {
    userId: string;
    githubUrl: string;
    githubOwner: string;
    repoName: string;
    cloudProvider: "vercel" | "netlify" | "";
}) => {
    const { userId, githubUrl, githubOwner, repoName, cloudProvider } = params;
    const session = await getServerSession()

    const email = (session as any)?.user?.email || "";

    if (!userId) throw new Error("Missing userId in session (mongoUserId/user.id).");
    if (!email) throw new Error("Missing user email in session. Make sure GitHub email scope is enabled.");

    await connectDB();

    const doc = await Project.findOneAndUpdate(
        { userId, githubOwner, repoName },
        {
            $set: {
                userId,
                email: String(email).toLowerCase(),
                githubOwner,
                repoName,
                githubUrl,
                cloudProvider,
            },
            $setOnInsert: {
                isDeployed: false,
                deployUrl: "",
            },
        },
        { upsert: true, new: true }
    );

    return doc;
};

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return json({ error: "Unauthorized" }, 401);

        const token = (session as any).githubAccessToken as string | undefined;
        if (!token) {
            return json({ error: "Missing GitHub token. Sign out/in again." }, 401);
        }

        const body = await req.json().catch(() => ({}));
        const repoName = sanitizeRepoName(body?.repoName ?? "my-portfolio") || "my-portfolio";
        const draft = body?.draft as PortfolioDraft | undefined;
        if (!draft) return json({ error: "draft is required" }, 400);

        const templateOwner = process.env.GITHUB_TEMPLATE_OWNER!;
        const templateRepo = process.env.GITHUB_TEMPLATE_REPO!;
        if (!templateOwner || !templateRepo) {
            return json({ error: "Template repo env vars missing" }, 500);
        }

        const me = await gh<{ login: string }>(token, "https://api.github.com/user");
        const owner = me.login;

        const created = await gh<{ html_url: string }>(
            token,
            `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`,
            {
                method: "POST",
                body: JSON.stringify({
                    owner,
                    name: repoName,
                    private: false,
                    include_all_branches: false,
                }),
            }
        );

        const branch = await waitForRepoReady(token, owner, repoName);

        const path = "data/draft.json";

        let sha: string | undefined;
        try {
            const fileInfo = await gh<{ sha: string }>(
                token,
                `https://api.github.com/repos/${owner}/${repoName}/contents/${ghPath(path)}?ref=${encodeURIComponent(branch)}`
            );
            sha = fileInfo.sha;
        } catch (e) {
            console.log("Error in FileInfo: ", e)
            sha = undefined;
        }

        const content = Buffer.from(JSON.stringify(draft, null, 2), "utf8").toString("base64");

        await gh<any>(
            token,
            `https://api.github.com/repos/${owner}/${repoName}/contents/${ghPath(path)}`,
            {
                method: "PUT",
                body: JSON.stringify({
                    message: "Update portfolio data",
                    content,
                    ...(sha ? { sha } : {}),
                    branch,
                }),
            }
        );

        const vercelImportUrl = `https://vercel.com/new/import?s=https://github.com/${owner}/${repoName}`;

        await saveGithubProjectToDB({
            userId: body.userId,
            githubUrl: created.html_url,
            githubOwner: owner,
            repoName,
            cloudProvider: "",
        });

        return json({
            ok: true,
            repo: { owner, name: repoName, url: created.html_url },
            deploy: { vercel: vercelImportUrl },
        });
    } catch (e: any) {
        return json({ error: e?.message || "Publish failed" }, 500);
    }
}
