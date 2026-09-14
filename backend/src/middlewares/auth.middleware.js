import ApiError from "../utils/ApiError.js";

import {
    verifyAccessToken,
} from "../utils/token.util.js";

/**
 * @Name : authenticate
 * @param : req, res, next
 * @description :
 * Authenticates a request using the short-lived JWT access token.
 *
 * The middleware extracts the token from the Authorization header,
 * verifies its signature and expiration, and attaches the decoded
 * user information to req.user for use by protected controllers.
 */
const authenticate = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        /*
         * The expected format is:
         *
         * Authorization: Bearer <access-token>
         */
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            throw new ApiError(
                401,
                "Access token is required."
            );
        }

        const accessToken = authorizationHeader.split(" ")[1];

        if (!accessToken) {
            throw new ApiError(
                401,
                "Access token is required."
            );
        }

        const decodedToken = verifyAccessToken(
            accessToken
        );

        /*
         * Store the authenticated user's information on the request
         * so protected controllers can access it through req.user.
         */
        req.user = {
            userId: decodedToken.userId,
        };

        next();
    } catch (error) {
        /*
         * Convert JWT verification errors into a consistent API error.
         */
        if (error instanceof ApiError) {
            return next(error);
        }

        return next(
            new ApiError(
                401,
                "Invalid or expired access token."
            )
        );
    }
};

export default authenticate;