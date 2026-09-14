import { Router } from "express";

import {
    register,
    verifyEmail,
    resendVerificationEmail,
    login,
    refresh,
    getMe,
    logout,
    logoutAll,
    googleLogin,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile
} from "../controllers/auth.controller.js";

import authenticate from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

/**
 * @POST : /register
 * @description :
 * Registers a new Skillio user using email and password authentication.
 * @access : Public
 */
router.post("/register", register);

/**
 * @GET : /verify-email/:token
 * @description :
 * Verifies the user's email address using the verification token.
 * @access : Public
 */

router.get("/verify-email/:token", verifyEmail);

/**
 * @POST : /resend-verification
 * @description :
 * Sends a new email verification token to the user.
 * @access : Public
 */

router.post("/resend-verification", resendVerificationEmail);

/**
 * @POST : /login
 * @description :
 * Authenticates a Skillio user using email and password and creates
 * a new authenticated session.
 * @access : Public
 */
router.post("/login", login);

/**
 * @POST : /google
 * @description :
 * Google login/register
 * @access : Public
 */
router.post("/google", googleLogin);

/**
 * @POST : /refresh
 * @description :
 * Generates a new access token using the refresh token stored inside
 * the user's HttpOnly refresh-token cookie.
 * @access : Public
 */
router.post("/refresh", refresh);

/**
 * @GET : /me
 * @description :
 * Returns the profile of the currently authenticated user.
 * Requires a valid short-lived access token.
 * @access : Private
 */
router.get("/me", authenticate, getMe);

/**
 * @POST : /logout
 * @description :
 * Revokes the user's current authenticated session and removes
 * the refresh-token cookie from the browser.
 * @access : Private
 */
router.post("/logout", authenticate, logout);

/**
 * @POST : /logout-all
 * @description :
 * Revokes all active authenticated sessions belonging to the current
 * user and removes the refresh-token cookie from the browser.
 * @access : Private
 */
router.post("/logout-all", authenticate, logoutAll);


/**
 * @POST : /forgot-password
 * @description :
 * Sends a password reset email to the user.
 * @access : Public
 */
router.post("/forgot-password", forgotPassword);


/**
 * @POST : /reset-password/:token
 * @description :
 * Resets the user's password using a valid password reset token.
 * @access : Public
 */
router.post("/reset-password/:token", resetPassword);

/**
 * @POST : /change-password
 * @description :
 * Changes the authenticated user's password.
 * @access : Private
 */
router.post("/change-password", authenticate, changePassword);


/**
 * @PATCH : /auth/profile
*
* Updates the authenticated user's basic account information.
*
* Supported:
* - name
* - avatar
*
* Avatar is uploaded to Cloudinary using multipart/form-data.
 * @access : Private
 */
router.patch("/profile",authenticate,upload.single("avatar"),updateProfile);



export default router;