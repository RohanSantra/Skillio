import mongoose from "mongoose";

/**
 * @Name : CoachConversation
 * @param : userId, jobId, title, messages, lastMessageAt
 * @description :
 * Mongoose schema representing an AI Career Coach conversation.
 * Supports both general career conversations and job-specific conversations.
 * Job-specific conversations are associated with a Job Workspace so the AI
 * can provide context-aware guidance based on the selected job opportunity.
 */

const coachConversationSchema = new mongoose.Schema(
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
            default: null,
            index: true,
        },

        title: {
            type: String,
            trim: true,
            maxlength: 150,
            default: "New Conversation",
        },

        messages: [
            {
                role: {
                    type: String,
                    enum: ["user", "assistant"],
                    required: true,
                },

                content: {
                    type: String,
                    required: true,
                    trim: true,
                },

                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

coachConversationSchema.index({
    userId: 1,
    lastMessageAt: -1,
});

const CoachConversation = mongoose.model(
    "CoachConversation",
    coachConversationSchema
);

export default CoachConversation;