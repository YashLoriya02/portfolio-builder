import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI!;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in env");

let cached = (global as any).mongoose;
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME || undefined })
            .then((m) => m);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
