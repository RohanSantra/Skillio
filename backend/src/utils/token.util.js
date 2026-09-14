import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

/**
 * @Name : generateAccessToken
 * @param : userId
 * @description :
 * Generates a short-lived JWT access token containing the user's identity.
 * The access token is used to authorize protected API requests and is
 * intentionally kept short-lived to reduce the impact of token theft.
 */
const generateAccessToken = (userId) => {
    return jwt.sign(
        {
            userId,
        },
        config.ACCESS_TOKEN_SECRET,
        {
            expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
        }
    );
};

/**
 * @Name : generateRefreshToken
 * @param : userId, sessionId
 * @description :
 * Generates a long-lived JWT refresh token containing the user's identity
 * and associated session ID. The session ID allows the backend to associate
 * the refresh request with a specific authenticated session.
 */
const generateRefreshToken = (userId, sessionId) => {
    return jwt.sign(
        {
            userId,
            sessionId,
        },
        config.REFRESH_TOKEN_SECRET,
        {
            expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
        }
    );
};

/**
 * @Name : verifyAccessToken
 * @param : token
 * @description :
 * Verifies the signature and expiration of an access token and returns
 * its decoded payload. Throws an error when the token is invalid or expired.
 */
const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        config.ACCESS_TOKEN_SECRET
    );
};

/**
 * @Name : verifyRefreshToken
 * @param : token
 * @description :
 * Verifies the signature and expiration of a refresh token and returns
 * its decoded payload. Throws an error when the token is invalid or expired.
 */
const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        config.REFRESH_TOKEN_SECRET
    );
};

/**
 * @Name : hashRefreshToken
 * @param : token
 * @description :
 * Creates a SHA-256 hash of the refresh token before it is stored in the
 * database. The raw refresh token is never stored in the Session collection.
 */
const hashRefreshToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    hashRefreshToken,
};