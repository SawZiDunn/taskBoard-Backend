class ApiError extends Error {
    constructor(statusCode, msg) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ApiError;
