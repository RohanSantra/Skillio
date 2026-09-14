import mongoose from "mongoose";

/**
 * @Name : PreparationPlan
 * @param : userId, jobId, title, overview, tasks, progress, status
 * @description :
 * Mongoose schema representing a personalized preparation plan for a
 * specific job opportunity. Stores AI-generated preparation tasks,
 * their priorities, completion status, and overall preparation progress.
 */


const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 2000,
            default: "",
        },

        category: {
            type: String,
            enum: [
                "technical",
                "resume",
                "behavioral",
                "system-design",
                "company",
                "other",
            ],
            default: "other",
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },

        estimatedMinutes: {
            type: Number,
            min: 1,
            default: 30,
        },

        dueDate: {
            type: Date,
            default: null,
        },

        isCompleted: {
            type: Boolean,
            default: false,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    }
)

const preparationPlanSchema = new mongoose.Schema(
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

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        overview: {
            type: String,
            trim: true,
            maxlength: 3000,
            default: "",
        },

        tasks: [taskSchema],

        progress: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },

        status: {
            type: String,
            enum: ["not-started", "in-progress", "completed"],
            default: "not-started",
        },

        generatedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

preparationPlanSchema.index(
    { userId: 1, jobId: 1 },
    { unique: true }
);

const PreparationPlan = mongoose.model(
    "PreparationPlan",
    preparationPlanSchema
);

export default PreparationPlan;