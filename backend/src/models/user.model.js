import mongoose from "mongoose";

/**
 * @Name : User
 * @param : name, email, passwordHash, googleId, avatar, isEmailVerified
 * @description :
 * Mongoose schema representing a Skillio user.
 * Supports both email/password authentication and Google OAuth,
 * while allowing either authentication method to exist independently.
 */


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        passwordHash: {
            type: String,
            default: null,
        },

        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },

        avatar: {
            type: String,
            default: null,
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;