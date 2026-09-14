import mongoose from "mongoose";

/**
 * @Name : JobWorkspace
 * @param : userId, company, role, jobDescription, source, status, jobAnalysis, jobMatch, skillGaps
 * @description :
 * Mongoose schema representing a user's workspace for a specific job opportunity.
 * Stores the job description and AI-generated job intelligence such as job analysis,
 * profile matching, and identified skill gaps.
 * Each workspace is independent, allowing users to prepare for and maintain
 * multiple job opportunities simultaneously.
 */

const jobWorkspaceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        company: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        role: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        jobDescription: {
            type: String,
            required: true,
            trim: true,
        },

        source: {
            type: String,
            enum: ["manual", "url", "upload"],
            default: "manual",
        },

        status: {
            type: String,
            enum: ["active", "archived"],
            default: "active",
        },

        jobAnalysis: {
            summary: {
                type: String,
                default: "",
            },

            responsibilities: [
                {
                    type: String,
                    trim: true,
                },
            ],

            requiredSkills: [
                {
                    type: String,
                    trim: true,
                },
            ],

            preferredSkills: [
                {
                    type: String,
                    trim: true,
                },
            ],

            experienceRequired: {
                type: String,
                default: "",
            },

            educationRequired: {
                type: String,
                default: "",
            },

            keywords: [
                {
                    type: String,
                    trim: true,
                },
            ],

            analyzedAt: {
                type: Date,
                default: null,
            },
        },

        jobMatch: {
            score: {
                type: Number,
                min: 0,
                max: 100,
                default: null,
            },

            matchedSkills: [
                {
                    type: String,
                    trim: true,
                },
            ],

            missingSkills: [
                {
                    type: String,
                    trim: true,
                },
            ],

            strengths: [
                {
                    type: String,
                    trim: true,
                },
            ],

            analyzedAt: {
                type: Date,
                default: null,
            },
        },

        skillGaps: [
            {
                skill: {
                    type: String,
                    required: true,
                    trim: true,
                },

                importance: {
                    type: String,
                    enum: ["low", "medium", "high", "critical"],
                    default: "medium",
                },

                reason: {
                    type: String,
                    default: "",
                },

                recommendation: {
                    type: String,
                    default: "",
                },
            },
        ],
        resumeATSAnalysis: {
            resumeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Resume",
                default: null,
            },

            score: {
                type: Number,
                min: 0,
                max: 100,
                default: null,
            },

            matchedKeywords: [
                {
                    type: String,
                    trim: true,
                },
            ],

            missingKeywords: [
                {
                    type: String,
                    trim: true,
                },
            ],

            strengths: [
                {
                    type: String,
                    trim: true,
                },
            ],

            weaknesses: [
                {
                    type: String,
                    trim: true,
                },
            ],

            suggestions: [
                {
                    type: String,
                    trim: true,
                },
            ],

            analyzedAt: {
                type: Date,
                default: null,
            },
        },
    },
    {
        timestamps: true,
    }
);


jobWorkspaceSchema.index({
    userId: 1,
    status: 1,
    updatedAt: -1,
});


const JobWorkspace = mongoose.model(
    "JobWorkspace",
    jobWorkspaceSchema
);

export default JobWorkspace;