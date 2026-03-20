/**
 * Custom error class for representing HTTP-specific errors.
 *
 * Extends the native JavaScript Error class by including an HTTP
 * status code, allowing centralized error handling middleware to
 * determine the appropriate response status.
 *
 * @class HttpError
 * @extends Error
 *
 * @param {number} statusCode - HTTP status code associated with the error
 * @param {string} message - The error message
 *
 * @example
 * throw new HttpError(404, "Resource not found")
 */
class HttpError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }
}

module.exports = HttpError