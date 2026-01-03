import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            // clientId: process.env.AUTH_GITHUB_ID_LOCAL!,
            // clientSecret: process.env.AUTH_GITHUB_SECRET_LOCAL!,
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
            authorization: {
                params: { scope: "read:user user:email repo" },
            },
        }),
    ],
    session: { strategy: "jwt" },
    pages: { signIn: "/login" },
    secret: process.env.AUTH_SECRET,

    callbacks: {
        async jwt({ token, account }) {
            if (account?.access_token) (token as any).githubAccessToken = account.access_token;
            return token;
        },
        async session({ session, token }) {
            (session as any).githubAccessToken = (token as any).githubAccessToken ?? "";
            return session;
        },
    },
};
