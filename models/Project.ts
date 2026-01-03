import mongoose, { Schema, models } from "mongoose";

export type CloudProvider = "vercel" | "netlify";

const ProjectSchema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        email: { type: String, required: true, lowercase: true, index: true },
        githubOwner: { type: String, required: true, index: true },
        repoName: { type: String, required: true, index: true },
        githubUrl: { type: String, required: true },
        cloudProvider: { type: String, enum: ["vercel", "netlify", ""], required: true },
        isDeployed: { type: Boolean, default: false },
        deployUrl: { type: String, default: "" },
        deployedAt: { type: Date },
    },
    { timestamps: true }
);

ProjectSchema.index({ userId: 1, githubOwner: 1, repoName: 1 }, { unique: true });

export const Project = models.Project || mongoose.model("Project", ProjectSchema);
