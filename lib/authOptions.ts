// import type { NextAuthOptions } from "next-auth";
// import GitHubProvider from "next-auth/providers/github";

// export const authOptions: NextAuthOptions = {
//     providers: [
//         GitHubProvider({
//             clientId: process.env.AUTH_GITHUB_ID_LOCAL!,
//             clientSecret: process.env.AUTH_GITHUB_SECRET_LOCAL!,
//             // clientId: process.env.AUTH_GITHUB_ID!,
//             // clientSecret: process.env.AUTH_GITHUB_SECRET!,
//             authorization: {
//                 params: { scope: "read:user user:email repo" },
//             },
//         }),
//     ],
//     session: { strategy: "jwt" },
//     pages: { signIn: "/login" },
//     secret: process.env.AUTH_SECRET,

//     callbacks: {
//         async jwt({ token, account }) {
//             if (account?.access_token) (token as any).githubAccessToken = account.access_token;
//             return token;
//         },
//         async session({ session, token }) {
//             (session as any).githubAccessToken = (token as any).githubAccessToken ?? "";
//             return session;
//         },
//     },
// };



import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signAppJwt } from "./jwt";

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.AUTH_GITHUB_ID_LOCAL!,
            clientSecret: process.env.AUTH_GITHUB_SECRET_LOCAL!,
            authorization: {
                params: { scope: "read:user user:email repo" },
            },
        }),
    ],

    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    secret: process.env.AUTH_SECRET,

    callbacks: {
        async jwt({ token, account, profile }) {
            // keep your existing github access token logic
            if (account?.access_token) (token as any).githubAccessToken = account.access_token;

            // Only on GitHub sign-in (account exists then)
            if (account?.provider === "github") {
                await connectDB();

                const githubId = String((profile as any)?.id ?? account.providerAccountId ?? "");
                const emailRaw =
                    (token.email as string | undefined) ||
                    ((profile as any)?.email as string | undefined) ||
                    null;

                const email = emailRaw ? emailRaw.toLowerCase() : null;

                const name =
                    (token.name as string | undefined) ||
                    ((profile as any)?.name as string | undefined) ||
                    ((profile as any)?.login as string | undefined) ||
                    null;

                const image =
                    (token.picture as string | undefined) ||
                    ((profile as any)?.avatar_url as string | undefined) ||
                    null;

                // Upsert user
                const dbUser = await User.findOneAndUpdate(
                    { githubId },
                    {
                        $set: {
                            githubId,
                            email,
                            name,
                            image,
                            provider: "github",
                            lastLoginAt: new Date(),
                        },
                    },
                    { upsert: true, new: true }
                );

                (token as any).mongoUserId = dbUser._id.toString();

                (token as any).appJwt = signAppJwt({
                    userId: dbUser._id.toString(),
                    githubId,
                    email,
                });
            }

            return token;
        },

        async session({ session, token }) {
            (session as any).githubAccessToken = (token as any).githubAccessToken ?? "";

            (session as any).mongoUserId = (token as any).mongoUserId ?? "";
            (session as any).appJwt = (token as any).appJwt ?? "";

            return session;
        },
    },
};
