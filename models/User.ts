import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
    {
        name: String,
        email: { type: String, lowercase: true, index: true },
        image: String,
        authProvider: { type: String, enum: ["github"], default: "github" },
        githubId: { type: String, index: true, unique: true, sparse: true },
        lastLoginAt: { type: Date },
    },
    { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
