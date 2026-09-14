import mongoose from "mongoose";

/**
 * @Name : InterviewSession
 * @param : userId, jobId, type, difficulty, questions, score, feedback, report, status, startedAt, completedAt
 * @description :
 * Mongoose schema representing a user's AI-powered interview session.
 * Stores interview configuration, generated questions, user answers,
 * AI feedback, performance scores, and the final interview report.
 * Each session is associated with a specific job workspace so that
 * interview preparation remains personalized to the selected role.
 */


const questionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            default: "",
        },

        userAnswer: {
            type: String,
            default: "",
        },

        feedback: {
            type: String,
            default: "",
        },

        score: {
            type: Number,
            min: 0,
            max: 10,
            default: null,
        },

        strengths: [
            {
                type: String,
                trim: true,
            },
        ],

        improvements: [
            {
                type: String,
                trim: true,
            },
        ],
    }
)

const interviewSessionSchema = new mongoose.Schema(
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

        type: {
            type: String,
            required: true,
            enum: [
                "technical",
                "resume",
                "job-description",
                "behavioral",
                "mock",
            ],
        },

        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium",
        },

        status: {
            type: String,
            enum: ["in-progress", "completed", "abandoned"],
            default: "in-progress",
        },

        questions: [questionSchema],

        score: {
            type: Number,
            min: 0,
            max: 100,
            default: null,
        },

        feedback: {
            type: String,
            maxlength: 5000,
            default: "",
        },

        report: {
            overallAssessment: {
                type: String,
                default: "",
            },

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

            recommendations: [
                {
                    type: String,
                    trim: true,
                },
            ],

            technicalScore: {
                type: Number,
                min: 0,
                max: 100,
                default: null,
            },

            communicationScore: {
                type: Number,
                min: 0,
                max: 100,
                default: null,
            },

            problemSolvingScore: {
                type: Number,
                min: 0,
                max: 100,
                default: null,
            },

            confidenceScore: {
                type: Number,
                min: 0,
                max: 100,
                default: null,
            },
        },

        startedAt: {
            type: Date,
            default: Date.now,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const InterviewSession = mongoose.model(
    "InterviewSession",
    interviewSessionSchema
);

export default InterviewSession;