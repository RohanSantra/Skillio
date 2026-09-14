/**
 * @Name : asyncHandler
 * @param : requestHandler
 * @description :
 * Higher-order function that wraps asynchronous Express route handlers
 * and forwards rejected promises to the next middleware.
 * This eliminates the need for repetitive try-catch blocks
 * inside asynchronous controllers.
 */

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch(err => next(err))
    }
}

export default asyncHandler;