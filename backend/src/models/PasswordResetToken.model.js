import mongoose from "mongoose";

/**
 * @Name : PasswordResetToken
 * @param : userId, tokenHash, expiresAt
 * @description :
 * Stores a hashed password reset token for a user.
 *
 * The raw token is sent to the user's email, while only its hash
 * is stored in the database.
 *
 * The document automatically expires after the reset token
 * reaches its expiration time.
 */

const passwordResetTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Automatically delete expired reset tokens.
passwordResetTokenSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const PasswordResetToken = mongoose.model(
    "PasswordResetToken",
    passwordResetTokenSchema
);

export default PasswordResetToken;