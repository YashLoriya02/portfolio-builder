import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";

export const runtime = "nodejs";

function json(data: any, status = 200) {
    return NextResponse.json(data, { status });
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return json({ error: "Unauthorized" }, 401);

        const userId = (session as any).mongoUserId || (session as any).user?.id || "";
        const userEmail = (session as any)?.user?.email || "";

        if (!userId) return json({ error: "Missing userId in session" }, 401);
        if (!userEmail) return json({ error: "Missing user email in session" }, 401);

        const body = await req.json().catch(() => ({}));

        const githubOwner = String((session as any)?.user.name || "").trim();
        const repoName = String(body?.repoName || "").trim();
        const cloudProvider = body?.cloudProvider === "netlify" ? "netlify" : "vercel";

        if (!githubOwner || !repoName) {
            return json({ error: "githubOwner and repoName are required" }, 400);
        }

        const update: any = {
            cloudProvider,
            deployedAt: new Date(),
            isDeployed: true,
            deployUrl: body.deployUrl.trim()
        };

        await connectDB();

        const doc = await Project.findOneAndUpdate(
            { userId, repoName },
            { $set: update },
            { new: true }
        );

        if (!doc) {
            return json(
                {
                    error: "Project not found for this user. Publish first or ensure githubOwner/repoName match.",
                },
                404
            );
        }

        return json({
            ok: true,
            project: {
                githubOwner: doc.githubOwner,
                repoName: doc.repoName,
                githubUrl: doc.githubUrl,
                cloudProvider: doc.cloudProvider,
                isDeployed: doc.isDeployed,
                deployUrl: doc.deployUrl,
            },
        });
    } catch (e: any) {
        return json({ error: e?.message || "Failed to update deploy status" }, 500);
    }
}
