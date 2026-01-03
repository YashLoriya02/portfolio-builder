import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Project } from "@/models/Project";

export const runtime = "nodejs";

function json(data: any, status = 200) {
    return NextResponse.json(data, { status });
}

export async function POST(
    req: Request,
    ctx: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await ctx.params;
        const body = await req.json().catch(() => ({}));

        const session = await getServerSession(authOptions);
        if (!session) return json({ error: "Unauthorized" }, 401);

        const sessionUserId =
            (session as any).mongoUserId || (session as any).user?.id || "";

        const uid = String(userId || "").trim();
        if (!uid) return json({ error: "userId param is required" }, 400);

        if (!sessionUserId || sessionUserId !== uid) {
            return json({ error: "Forbidden" }, 403);
        }

        await connectDB();

        const p = await Project.findOne({ githubUrl: body?.githubUrl });

        return json({
            ok: true,
            repo: { owner: p.githubOwner, name: p.repoName, url: p.githubUrl },
        });
    } catch (e: any) {
        return json({ error: e?.message || "Failed to fetch projects" }, 500);
    }
}
