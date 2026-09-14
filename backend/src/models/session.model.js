import mongoose from "mongoose";

/**
 * @Name : Session
 * @param : userId, refreshTokenHash, userAgent, ipAddress, device, lastUsedAt, expiresAt, isActive
 * @description :
 * Mongoose schema representing an authenticated user session.
 * Stores refresh-token information and session metadata so that
 * individual sessions can be tracked, expired, and revoked.
 */

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        refreshTokenHash: {
            type: String,
        },

        userAgent: {
            type: String,
            default: null,
        },

        ipAddress: {
            type: String,
            default: null,
        },

        device: {
            type: String,
            default: null,
        },

        lastUsedAt: {
            type: Date,
            default: Date.now,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

sessionSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;