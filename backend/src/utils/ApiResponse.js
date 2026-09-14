/**
 * @Name : ApiResponse
 * @param : statusCode, data, message
 * @description :
 * Standardized API response class used to maintain a consistent
 * response structure for successful API requests.
 */

class ApiResponse {
    constructor(statusCode, data, message = "success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export default ApiResponse;