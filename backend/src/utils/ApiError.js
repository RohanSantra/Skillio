/**
 * @Name : ApiError
 * @param : statusCode, message, errors, stack
 * @description :
 * Custom error class used to create standardized API errors.
 * Extends the native Error class with HTTP status code, error details,
 * and success status so that errors can be handled consistently
 * by the global error-handling middleware.
 */

class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong !",
        errors = [],
        stack = "") {


        super(message)
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export default ApiError;