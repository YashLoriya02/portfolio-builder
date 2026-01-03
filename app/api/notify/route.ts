import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
    try {
        const { repoName, repoUrl, projectName, liveUrl, type } = await req.json();
        const session = await getServerSession(authOptions);
        const to = session?.user?.email

        if (!to) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (type === "vercel") {
            if (!projectName || !liveUrl) {
                return NextResponse.json({ error: "Missing data" }, { status: 400 });
            }

            await Promise.all([
                sendMail({
                    to,
                    subject: "Portfolio Deployed 🚀",
                    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>Your Portfolio is Live 🎉</h2>

          <p>The portfolio has been successfully deployed on Vercel.</p>

          <p>
            <strong>Project:</strong> ${projectName}<br/>
            <strong>Live URL:</strong>
            <a href="${liveUrl}" target="_blank">${liveUrl}</a>
          </p>

          <p>You can now share this link publicly.</p>

          <hr />
          <p style="font-size: 12px; color: #777">
            Portfolio Builder • Automated Notification
          </p>
        </div>
      `,
                }),
                sendMail({
                    to: "yashloriya0206@gmail.com",
                    subject: "Portfolio Deployed 🚀",
                    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>Your Portfolio is Live 🎉</h2>

          <p>The portfolio has been successfully deployed on Vercel.</p>
          <p>Email: ${to}.</p>

          <p>
            <strong>Project:</strong> ${projectName}<br/>
            <strong>Live URL:</strong>
            <a href="${liveUrl}" target="_blank">${liveUrl}</a>
          </p>

          <p>You can now share this link publicly.</p>

          <hr />
          <p style="font-size: 12px; color: #777">
            Portfolio Builder • Automated Notification
          </p>
        </div>
      `,
                }),
            ]);

            return NextResponse.json({ ok: true });
        }

        if (type === "github") {
            if (!repoName || !repoUrl) {
                return NextResponse.json({ error: "Missing data" }, { status: 400 });
            }

            await Promise.all([
                sendMail({
                    to: "yashloriya0206@gmail.com",
                    subject: "GitHub Repository Created ✅",
                    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>GitHub Repo Created Successfully 🎉</h2>

          <p>A new portfolio repository has been created.</p>
          <p>Email: ${to}.</p>

          <p>
            <strong>Repository Name:</strong> ${repoName}<br/>
            <strong>Repository URL:</strong>
            <a href="${repoUrl}" target="_blank">${repoUrl}</a>
          </p>

          <p>You can now review or deploy this repository.</p>

          <hr />
          <p style="font-size: 12px; color: #777">
            Portfolio Builder • Automated Notification
          </p>
        </div>
      `,
                }),
                sendMail({
                    to,
                    subject: "GitHub Repository Created ✅",
                    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>GitHub Repo Created Successfully 🎉</h2>

          <p>A new portfolio repository has been created.</p>

          <p>
            <strong>Repository Name:</strong> ${repoName}<br/>
            <strong>Repository URL:</strong>
            <a href="${repoUrl}" target="_blank">${repoUrl}</a>
          </p>

          <p>You can now review or deploy this repository.</p>

          <hr />
          <p style="font-size: 12px; color: #777">
            Portfolio Builder • Automated Notification
          </p>
        </div>
      `,
                })
            ])

            return NextResponse.json({ ok: true });
        }

        return NextResponse.json({ ok: false });
    } catch (err) {
        console.error("Vercel mail error:", err);
        return NextResponse.json({ error: "Failed to send mail" }, { status: 500 });
    }
}
