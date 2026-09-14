import ApiError from "../utils/ApiError.js";
import multer from "multer";

/**
 * @Name : errorHandler
 * @param : err, req, res, next
 * @description :
 * Global error-handling middleware for the Skillio API.
 *
 * Converts application and unexpected errors into a consistent API
 * response format while preventing internal error details from being
 * exposed to the client in production.
 * @access : Internal
 */
const errorHandler = (err, req, res, next) => {
    let error = err;

    /*
     * Multer errors happen before the controller. Convert them here so an
     * oversized file or an unexpected multipart field is a useful client
     * error instead of an opaque 500 response.
     */
    if (err instanceof multer.MulterError) {
        const message =
            err.code === "LIMIT_FILE_SIZE"
                ? "Resume file must be smaller than 5 MB."
                : "Invalid resume upload.";

        error = new ApiError(400, message);
    }

    /*
     * Convert unknown errors into our standard ApiError format.
     */
    if (!(error instanceof ApiError)) {
        error = new ApiError(
            500,
            "Internal server error."
        );
    }

    const response = {
        success: false,
        message: error.message,
        data: null,
    };

    /*
     * Include validation or additional application errors when available.
     */
    if (error.errors?.length) {
        response.errors = error.errors;
    }

    /*
     * Log unexpected server errors for debugging.
     * Avoid exposing stack traces to the client.
     */
    if (error.statusCode >= 500) {
        console.error(err);
    }

    return res.status(error.statusCode).json(response);
};

export default errorHandler;
