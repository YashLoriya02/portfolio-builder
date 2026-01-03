import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";

export const runtime = "nodejs";

function json(data: any, status = 200) {
    return NextResponse.json(data, { status });
}

export async function GET(
    req: Request,
    ctx: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await ctx.params;

        const session = await getServerSession(authOptions);
        if (!session) return json({ error: "Unauthorized" }, 401);

        const sessionUserId =
            (session as any).mongoUserId || (session as any).user?.id || "";

        const uid = String(userId || "").trim();
        if (!uid) return json({ error: "userId param is required" }, 400);

        if (!sessionUserId || sessionUserId !== uid) {
            return json({ error: "Forbidden" }, 403);
        }

        const { searchParams } = new URL(req.url);
        const countOnly = searchParams.get("count") === "true";

        await connectDB();

        if (countOnly) {
            const totalCount = await Project.countDocuments({ userId: uid });

            return json({
                ok: true,
                totalCount,
            });
        }

        const projects = await Project.find({ userId: uid })
            .select(
                "repoName githubUrl userId deployUrl isDeployed createdAt deployedAt cloudProvider"
            )
            .sort({ createdAt: -1 })
            .lean();

        return json({
            ok: true,
            count: projects.length,
            data: projects.map((p: any) => ({
                repoName: p.repoName,
                githubUrl: p.githubUrl,
                userId: p.userId,
                deployUrl: p.deployUrl || "",
                isDeployed: !!p.isDeployed,
                createdAt: p.createdAt,
                deployedAt: p.deployedAt ?? null,
                cloudProvider: p.cloudProvider,
            })),
        });
    } catch (e: any) {
        return json({ error: e?.message || "Failed to fetch projects" }, 500);
    }
}
