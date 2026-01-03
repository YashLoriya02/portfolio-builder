import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;
if (!secret) throw new Error("Missing JWT_SECRET");

export function signAppJwt(payload: {
    userId: string;
    githubId: string;
    email?: string | null;
}) {
    return jwt.sign(payload, secret, { expiresIn: "30d" });
}
