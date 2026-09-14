import mongoose from "mongoose";

/**
 * @Name : Application
 * @param : userId, jobId, status, appliedAt, notes
 * @description :
 * Mongoose schema representing a user's application for a specific job.
 * Stores the current application status, application date, and optional
 * notes while maintaining a relationship with the corresponding job workspace.
 */

const applicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobWorkspace",
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: [
                "saved",
                "applied",
                "interview",
                "offer",
                "rejected",
            ],
            default: "saved",
        },

        appliedAt: {
            type: Date,
            default: null,
        },

        notes: {
            type: String,
            trim: true,
            maxlength: 3000,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);


applicationSchema.index(
    { userId: 1, jobId: 1 },
    { unique: true }
);


const Application = mongoose.model(
    "Application",
    applicationSchema
);

export default Application;