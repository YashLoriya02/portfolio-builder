import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";

export const runtime = "nodejs";

function json(data: any, status = 200) {
    return NextResponse.json(data, { status });
}

export async function DELETE(
    req: Request,
    ctx: { params: Promise<{ userId: string; githubUrl: string }> }
) {
    try {
        let { userId, githubUrl } = await ctx.params;

        const session = await getServerSession(authOptions);
        if (!session) return json({ error: "Unauthorized" }, 401);

        const sessionUserId =
            (session as any).mongoUserId || (session as any).user?.id || "";

        if (!sessionUserId || sessionUserId !== userId) {
            return json({ error: "Forbidden" }, 403);
        }

        githubUrl = decodeURIComponent(githubUrl || "").trim();
        if (!githubUrl) {
            return json({ error: "githubUrl (selected) is required" }, 400);
        }

        await connectDB();

        const deleted = await Project.findOneAndDelete({
            userId,
            githubUrl,
        });

        if (!deleted) {
            return json(
                { error: "Project not found or already deleted" },
                404
            );
        }

        return json({
            ok: true,
            message: "Project deleted successfully",
            deleted: {
                repoName: deleted.repoName,
                githubUrl: deleted.githubUrl,
                cloudProvider: deleted.cloudProvider,
            },
        });
    } catch (e: any) {
        return json({ error: e?.message || "Failed to delete project" }, 500);
    }
}
