import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    mongoUserId: string,
    appJwt: string,
    githubAccessToken: string,
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
