import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import EmailVerificationToken from "../models/emailVerificationToken.model.js";
import PasswordResetToken from "../models/PasswordResetToken.model.js";
import crypto from "crypto";

import {
    hashPassword,
    comparePassword,
} from "../utils/password.util.js";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashRefreshToken,
} from "../utils/token.util.js";

import verifyGoogleToken from "../utils/google.util.js";

import {
    sendVerificationEmail,
    sendPasswordResetEmail
} from "../services/email.service.js";
import {
    uploadOnCloudinary,
    deleteOnCloudinary,
} from "../utils/cloudinary.js";


import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @Name : setRefreshTokenCookie
 * @param : res, refreshToken
 * @description :
 * Stores the refresh token inside a secure HttpOnly cookie.
 *
 * The cookie cannot be accessed through frontend JavaScript.
 * The browser automatically sends it with requests to the backend.
 */
const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

/**
 * @Name : clearRefreshTokenCookie
 * @param : res
 * @description :
 * Removes the refresh token cookie from the user's browser.
 *
 * This is used when the user logs out or when the refresh token
 * is no longer considered valid.
 */
const clearRefreshTokenCookie = (res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
};

/**
 * @Name : register
 * @POST : /register
 * @access : Public
 * @description :
 * Creates a new Skillio account using email and password.
 *
 * The backend checks whether the email already belongs to an existing
 * account. Google-only accounts cannot be silently converted into
 * password accounts because doing so could create an account takeover risk.
 *
 * After registration, an authenticated session is created and:
 * - the access token is returned in the response
 * - the refresh token is stored in an HttpOnly cookie
 */
const register = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        password,
    } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(
            400,
            "Name, email and password are required."
        );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
        email: normalizedEmail,
    });

    if (existingUser) {

        if (!existingUser.passwordHash && existingUser.googleId) {
            throw new ApiError(
                409,
                "An account already exists with this email. Please sign in with Google."
            );
        }

        throw new ApiError(
            409,
            "An account already exists with this email."
        );
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
    });

    // Generate verification token
    const verificationToken =crypto.randomBytes(32).toString("hex");

    // Store only token hash in database
    const tokenHash = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

    await EmailVerificationToken.create({
        userId: user._id,
        tokenHash,
        expiresAt: new Date(
            Date.now() + 15 * 60 * 1000
        ),
    });

    // Send verification email
    await sendVerificationEmail(
        user.email,
        user.name,
        verificationToken
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified,
                },
            },
            "Account created successfully. Please verify your email."
        )
    );
});

/**
 * @Name : verifyEmail
 * @GET : /verify-email/:token
 * @access : Public
 * @description :
 * Verifies the user's email using the verification token
 * received through email.
 */

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token) {
        throw new ApiError(
            400,
            "Verification token is required."
        );
    }

    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const verificationToken =
        await EmailVerificationToken.findOne({
            tokenHash,
        });

    if (!verificationToken) {
        throw new ApiError(
            400,
            "Invalid or expired verification token."
        );
    }

    if (verificationToken.expiresAt < new Date()) {
        await EmailVerificationToken.deleteOne({
            _id: verificationToken._id,
        });

        throw new ApiError(
            400,
            "Verification token has expired."
        );
    }

    const user = await User.findById(
        verificationToken.userId
    );

    if (!user) {
        await EmailVerificationToken.deleteOne({
            _id: verificationToken._id,
        });

        throw new ApiError(
            404,
            "User not found."
        );
    }

    // Already verified
    if (user.isEmailVerified) {
        await EmailVerificationToken.deleteOne({
            _id: verificationToken._id,
        });

        throw new ApiError(
            400,
            "Email is already verified."
        );
    }

    // -----------------------------------------
    // 1. Verify email
    // -----------------------------------------

    user.isEmailVerified = true;

    await user.save();

    // Token cannot be reused
    await EmailVerificationToken.deleteOne({
        _id: verificationToken._id,
    });

    // -----------------------------------------
    // 2. Create authenticated session
    // -----------------------------------------

    const session = await Session.create({
        userId: user._id,
        userAgent: req.get("User-Agent"),
        ipAddress: req.ip,
        expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
    });

    // -----------------------------------------
    // 3. Generate refresh token
    // -----------------------------------------

    const refreshToken = generateRefreshToken(
        user._id.toString(),
        session._id.toString()
    );

    // Store only hashed refresh token
    session.refreshTokenHash =
        hashRefreshToken(refreshToken);

    await session.save();

    // -----------------------------------------
    // 4. Generate access token
    // -----------------------------------------

    const accessToken = generateAccessToken(
        user._id.toString()
    );

    // -----------------------------------------
    // 5. Store refresh token in cookie
    // -----------------------------------------

    setRefreshTokenCookie(
        res,
        refreshToken
    );

    // -----------------------------------------
    // 6. Return authenticated user
    // -----------------------------------------

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    isEmailVerified: user.isEmailVerified,
                },
                accessToken,
            },
            "Email verified successfully. You are now logged in."
        )
    );
});


/**
 * @Name : resendVerificationEmail
 * @POST : /resend-verification
 * @access : Public
 * @description :
 * Generates and sends a new email verification token.
 */

const resendVerificationEmail = asyncHandler(
    async (req, res) => {

        const { email } = req.body;

        if (!email) {
            throw new ApiError(
                400,
                "Email is required."
            );
        }

        const normalizedEmail =
            email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        /*
         * Do not reveal whether an email exists.
         */
        if (!user) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    null,
                    "If an account exists with this email, a verification email has been sent."
                )
            );
        }

        if (user.isEmailVerified) {
            throw new ApiError(
                400,
                "Email is already verified."
            );
        }

        /*
         * Remove any previous verification tokens.
         */
        await EmailVerificationToken.deleteMany({
            userId: user._id,
        });

        const verificationToken =
            crypto.randomBytes(32).toString("hex");

        const tokenHash = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        await EmailVerificationToken.create({
            userId: user._id,
            tokenHash,
            expiresAt: new Date(
                Date.now() + 15 * 60 * 1000
            ),
        });

        await sendVerificationEmail(
            user.email,
            user.name,
            verificationToken
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Verification email sent successfully."
            )
        );
    }
);

/**
 * @Name : login
 * @POST : /login
 * @access : Public
 * @description :
 * Authenticates an existing Skillio user using email and password.
 *
 * A new database session is created for every successful login.
 * The access token is returned to the frontend while the refresh token
 * is stored securely inside an HttpOnly cookie.
 */
const login = asyncHandler(async (req, res) => {
    const {
        email,
        password,
        device,
    } = req.body;

    if (!email || !password) {
        throw new ApiError(
            400,
            "Email and password are required."
        );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
        email: normalizedEmail,
    });

    /**
     * Use a generic error so that the API does not reveal
     * whether an email address exists.
     */
    if (!user) {
        throw new ApiError(
            401,
            "Invalid email or password."
        );
    }

    /**
     * A missing passwordHash means this account does not currently
     * support password authentication.
     *
     * For example, it may be a Google-only account.
     */
    if (!user.passwordHash) {
        throw new ApiError(
            401,
            "This account uses Google sign-in. Please continue with Google."
        );
    }

    const isPasswordValid = await comparePassword(
        password,
        user.passwordHash
    );

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid email or password."
        );
    }


    if (!user.isEmailVerified) {
        throw new ApiError(
            403,
            "Please verify your email before logging in."
        );
    }

    /**
     * Create a new session for this login.
     */
    const session = await Session.create({
        userId: user._id,
        userAgent: req.get("User-Agent"),
        ipAddress: req.ip,
        device: device || null,
        expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
    });

    /**
     * Generate the refresh token containing the user ID
     * and the specific session ID.
     */
    const refreshToken = generateRefreshToken(
        user._id.toString(),
        session._id.toString()
    );

    /**
     * Store only the hashed refresh token.
     */
    session.refreshTokenHash = hashRefreshToken(
        refreshToken
    );

    await session.save();

    const accessToken = generateAccessToken(
        user._id.toString()
    );

    setRefreshTokenCookie(
        res,
        refreshToken
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user,
                accessToken,
            },
            "Login successful."
        )
    );
});

/**
 * @Name : refresh
 * @POST : /refresh
 * @access : Public
 * @description :
 * Generates a new access token using the refresh token stored
 * inside the HttpOnly cookie.
 *
 * The refresh token is verified, its database session is checked,
 * and the refresh token is rotated before returning a new access token.
 */
const refresh = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new ApiError(
            401,
            "Refresh token is required."
        );
    }

    let decodedToken;

    try {
        decodedToken = verifyRefreshToken(
            refreshToken
        );
    } catch (error) {
        clearRefreshTokenCookie(res);

        throw new ApiError(
            401,
            "Invalid or expired refresh token."
        );
    }

    const {
        userId,
        sessionId,
    } = decodedToken;

    /**
     * Find the exact active session referenced by the refresh token.
     *
     * Checking both userId and sessionId prevents a session belonging
     * to one user from being used against another user's account.
     */
    const session = await Session.findOne({
        _id: sessionId,
        userId,
        isActive: true,
        expiresAt: {
            $gt: new Date(),
        },
    });

    if (!session) {
        clearRefreshTokenCookie(res);

        throw new ApiError(
            401,
            "Session is invalid or has expired."
        );
    }

    /**
     * Hash the incoming refresh token and compare it with
     * the hash stored in the database.
     */
    const incomingTokenHash = hashRefreshToken(
        refreshToken
    );

    if (incomingTokenHash !== session.refreshTokenHash) {

        /**
         * A refresh-token mismatch may indicate token reuse.
         *
         * Revoke the session so the old token cannot continue
         * being used.
         */
        session.isActive = false;

        await session.save();

        clearRefreshTokenCookie(res);

        throw new ApiError(
            401,
            "Invalid refresh token."
        );
    }

    /**
     * Rotate the refresh token.
     *
     * The previous refresh token becomes invalid immediately
     * because its hash is replaced in the database.
     */
    const newRefreshToken = generateRefreshToken(
        userId,
        sessionId
    );

    session.refreshTokenHash = hashRefreshToken(
        newRefreshToken
    );

    session.lastUsedAt = new Date();

    await session.save();

    /**
     * Generate a new short-lived access token.
     */
    const newAccessToken = generateAccessToken(
        userId
    );

    /**
     * Replace the old refresh token cookie.
     */
    setRefreshTokenCookie(
        res,
        newRefreshToken
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                accessToken: newAccessToken,
            },
            "Access token refreshed successfully."
        )
    );
});

/**
 * @Name : getMe
 * @GET : /me
 * @access : Private
 * @description :
 * Returns the currently authenticated user's public profile.
 *
 * The user's ID comes from the access-token authentication middleware.
 * Sensitive authentication information such as passwordHash is excluded
 * from the database query.
 */
const getMe = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const user = await User.findById(
        userId
    ).select("-passwordHash");

    if (!user) {
        throw new ApiError(
            404,
            "User not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user,
            },
            "User retrieved successfully."
        )
    );
});

/**
 * @Name : logout
 * @POST : /logout
 * @access : Private
 * @description :
 * Logs the user out from the current authenticated session.
 *
 * The access token identifies the authenticated user, while the
 * refresh token stored inside the HttpOnly cookie identifies the
 * specific database session that should be revoked.
 */
const logout = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const refreshToken = req.cookies?.refreshToken;

    if (!userId || !refreshToken) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    let decodedToken;

    try {
        decodedToken = verifyRefreshToken(
            refreshToken
        );
    } catch (error) {
        clearRefreshTokenCookie(res);

        throw new ApiError(
            401,
            "Invalid or expired refresh token."
        );
    }

    /**
     * Make sure the refresh token belongs to the same
     * user identified by the access token.
     */
    if (decodedToken.userId !== userId) {
        clearRefreshTokenCookie(res);

        throw new ApiError(
            401,
            "Invalid session."
        );
    }

    /**
     * Find the exact active session belonging to the user.
     */
    const session = await Session.findOne({
        _id: decodedToken.sessionId,
        userId,
        isActive: true,
    });

    if (!session) {
        clearRefreshTokenCookie(res);

        throw new ApiError(
            401,
            "Session is already invalid."
        );
    }

    /**
     * Revoke only this particular session.
     */
    session.isActive = false;

    await session.save();

    /**
     * Remove the refresh token from the browser.
     */
    clearRefreshTokenCookie(res);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Logged out successfully."
        )
    );
});

/**
 * @Name : logoutAll
 * @POST : /logout-all
 * @access : Private
 * @description :
 * Logs the user out from all active sessions across all devices.
 *
 * Every active session belonging to the authenticated user is revoked.
 * The refresh token cookie for the current browser is also removed.
 */
const logoutAll = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    /**
     * Revoke every active session belonging to this user.
     *
     * This invalidates refresh tokens across all devices.
     */
    await Session.updateMany(
        {
            userId,
            isActive: true,
        },
        {
            $set: {
                isActive: false,
            },
        }
    );

    /**
     * Remove the current browser's refresh token.
     */
    clearRefreshTokenCookie(res);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Logged out from all devices successfully."
        )
    );
});

const googleLogin = asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        throw new ApiError(
            400,
            "Google ID token is required."
        );
    }

    let googleUser;

    try {
        googleUser = await verifyGoogleToken(idToken);
    } catch (error) {
        throw new ApiError(
            401,
            "Invalid Google authentication."
        );
    }

    const {
        sub: googleId,
        email,
        name,
        picture,
        email_verified: emailVerified,
    } = googleUser;

    if (!email || !googleId || !emailVerified) {
        throw new ApiError(
            401,
            "Unable to verify Google account."
        );
    }

    const normalizedEmail = email
        .toLowerCase()
        .trim();

    let user = await User.findOne({
        $or: [
            { googleId },
            { email: normalizedEmail },
        ],
    });

    // -----------------------------------------
    // Existing user
    // -----------------------------------------

    if (user) {

        // Existing email account being connected
        if (!user.googleId) {
            user.googleId = googleId;
        }

        if (!user.avatar && picture) {
            user.avatar = picture;
        }

        user.isEmailVerified = true;

        await user.save();
    }

    // -----------------------------------------
    // New Google user
    // -----------------------------------------

    else {
        user = await User.create({
            name: name?.trim() || "Google User",
            email: normalizedEmail,
            googleId,
            avatar: picture || null,
            passwordHash: null,
            isEmailVerified: true,
        });
    }

    // -----------------------------------------
    // Create session
    // -----------------------------------------

    const session = await Session.create({
        userId: user._id,
        userAgent: req.get("User-Agent"),
        ipAddress: req.ip,
        expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
    });

    // -----------------------------------------
    // Refresh token
    // -----------------------------------------

    const refreshToken = generateRefreshToken(
        user._id.toString(),
        session._id.toString()
    );

    session.refreshTokenHash =
        hashRefreshToken(refreshToken);

    await session.save();

    // -----------------------------------------
    // Access token
    // -----------------------------------------

    const accessToken = generateAccessToken(
        user._id.toString()
    );

    setRefreshTokenCookie(
        res,
        refreshToken
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    isEmailVerified:
                        user.isEmailVerified,
                },
                accessToken,
            },
            "Google authentication successful."
        )
    );
});


/**
 * @Name : forgotPassword
 * @POST : /forgot-password
 * @access : Public
 * @description :
 * Sends a password reset email to the user.
 */
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(
            400,
            "Email is required."
        );
    }

    const normalizedEmail = email
        .trim()
        .toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail,
    });

    /*
     * Do not reveal whether an account exists.
     */
    if (!user) {
        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "If an account exists with this email, a password reset link has been sent."
            )
        );
    }

    /*
     * Remove any existing reset tokens for this user.
     */
    await PasswordResetToken.deleteMany({
        userId: user._id,
    });

    /*
     * Generate a cryptographically secure raw token.
     */
    const rawToken = crypto
        .randomBytes(32)
        .toString("hex");

    /*
     * Store only the hash in MongoDB.
     */
    const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    /*
     * Token expires after 15 minutes.
     */
    const expiresAt = new Date(
        Date.now() + 15 * 60 * 1000
    );

    await PasswordResetToken.create({
        userId: user._id,
        tokenHash,
        expiresAt,
    });

    /*
     * Send the RAW token to the user's email.
     * The database only contains the hash.
     */
    await sendPasswordResetEmail(
        user.email,
        user.name,
        rawToken
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "If an account exists with this email, a password reset link has been sent."
        )
    );
});


/**
 * @Name : resetPassword
 * @POST : /reset-password/:token
 * @access : Public
 * @description :
 * Resets the user's password using a valid password reset token.
 */
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
        throw new ApiError(
            400,
            "Reset token is required."
        );
    }

    if (!password) {
        throw new ApiError(
            400,
            "New password is required."
        );
    }

    /*
     * Hash the token received from the URL.
     * Only the hash exists in the database.
     */
    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const resetToken = await PasswordResetToken.findOne({
        tokenHash,
    });

    if (!resetToken) {
        throw new ApiError(
            400,
            "Invalid or expired reset token."
        );
    }

    /*
     * Extra expiration check.
     *
     * MongoDB's TTL deletion is not immediate, so we must
     * explicitly check the expiration ourselves.
     */
    if (resetToken.expiresAt <= new Date()) {
        await PasswordResetToken.deleteOne({
            _id: resetToken._id,
        });

        throw new ApiError(
            400,
            "Invalid or expired reset token."
        );
    }

    const user = await User.findById(
        resetToken.userId
    );

    if (!user) {
        await PasswordResetToken.deleteOne({
            _id: resetToken._id,
        });

        throw new ApiError(
            400,
            "Invalid or expired reset token."
        );
    }

    /*
     * Hash the new password using the same password
     * hashing utility used during registration/login.
     *
     * Replace hashPassword with the exact utility
     * already used in your auth controller.
     */
    user.passwordHash = await hashPassword(password);

    /*
     * A password reset should also verify the account's
     * email because the reset link was delivered to that email.
     */
    user.isEmailVerified = true;

    await user.save();

    /*
     * Invalidate the used reset token.
     * This makes the reset link one-time use.
     */
    await PasswordResetToken.deleteOne({
        _id: resetToken._id,
    });

    /*
     * Important:
     * Revoke all existing sessions so previously issued
     * refresh tokens can no longer be used.
     */
    await Session.updateMany(
        {
            userId: user._id,
            isActive: true,
        },
        {
            $set: {
                isActive: false,
            },
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Password reset successfully. Please log in again."
        )
    );
});


/**
 * @Name : changePassword
 * @POST : /change-password
 * @access : Private
 * @description :
 * Changes the authenticated user's password.
 */
const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const {
        currentPassword,
        newPassword,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!currentPassword || !newPassword) {
        throw new ApiError(
            400,
            "Current password and new password are required."
        );
    }

    if (currentPassword === newPassword) {
        throw new ApiError(
            400,
            "New password must be different from the current password."
        );
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found."
        );
    }

    /*
     * Google-only accounts don't have a password.
     */
    if (!user.passwordHash) {
        throw new ApiError(
            400,
            "This account does not have a password. Please use Google authentication."
        );
    }

    /*
     * Verify the current password using the same
     * password comparison utility used during login.
     */
    const isPasswordCorrect = await comparePassword(
        currentPassword,
        user.passwordHash
    );

    if (!isPasswordCorrect) {
        throw new ApiError(
            401,
            "Current password is incorrect."
        );
    }

    /*
     * Hash the new password using the same hashing
     * utility used during registration.
     */
    user.passwordHash = await hashPassword(
        newPassword
    );

    await user.save();

    /*
     * Revoke all existing sessions.
     *
     * This forces the user to authenticate again on
     * all devices after changing their password.
     */
    await Session.updateMany(
        {
            userId,
            isActive: true,
        },
        {
            $set: {
                isActive: false,
            },
        }
    );

    /*
     * The current access token may still technically
     * exist until it expires, but all refresh sessions
     * have been revoked.
     */
    clearRefreshTokenCookie(res);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Password changed successfully. Please log in again."
        )
    );
});




/**
 * @Name : updateProfile
 * @PATCH : /auth/profile
 * @access : Private
 *
 * Updates the authenticated user's basic account information.
 *
 * Supported:
 * - name
 * - avatar
 *
 * Avatar is uploaded to Cloudinary using multipart/form-data.
 */
const updateProfile = asyncHandler(async (req, res) => {

    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }


    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(
            404,
            "User not found."
        );
    }


    const { name } = req.body;


    /*
     * ==========================================
     * NAME
     * ==========================================
     */

    if (name !== undefined) {

        const cleanedName = name.trim();

        if (cleanedName.length < 2) {
            throw new ApiError(
                400,
                "Name must contain at least 2 characters."
            );
        }

        if (cleanedName.length > 50) {
            throw new ApiError(
                400,
                "Name cannot exceed 50 characters."
            );
        }

        user.name = cleanedName;
    }


    /*
     * ==========================================
     * AVATAR
     * ==========================================
     */

    if (req.file) {

        const uploadedAvatar =
            await uploadOnCloudinary(req.file.path);

        if (!uploadedAvatar?.secure_url) {
            throw new ApiError(
                500,
                "Failed to upload avatar."
            );
        }


        const previousAvatar = user.avatar;

        user.avatar =
            uploadedAvatar.secure_url;


        /*
         * Delete the previous Cloudinary avatar
         * only after the new upload succeeded.
         */
        if (
            previousAvatar &&
            previousAvatar !== user.avatar
        ) {
            await deleteOnCloudinary(
                previousAvatar
            );
        }
    }


    /*
     * ==========================================
     * PREVENT EMPTY UPDATE
     * ==========================================
     */

    if (
        name === undefined &&
        !req.file
    ) {
        throw new ApiError(
            400,
            "No profile changes were provided."
        );
    }


    await user.save();


    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    isEmailVerified:
                        user.isEmailVerified,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
            "Profile updated successfully."
        )
    );
});



export {
    register,
    verifyEmail,
    resendVerificationEmail,
    login,
    refresh,
    getMe,
    setRefreshTokenCookie,
    clearRefreshTokenCookie,
    logout,
    logoutAll,
    googleLogin,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile
};