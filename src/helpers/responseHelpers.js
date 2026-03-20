/**
 * Generates a standardized error response for a GET request.
 *
 * The response must always contain name, email, and message fields
 * so they are explicitly set to null when an error occurs. The error
 * field is also set to whatever message is specified.
 *
 * @function formatErrorMessage
 * @param {string} message - Error message describing the failure.
 * @param {Object} [extra={}] - Optional additional fields to include in the response.
 * @returns {Object} - Structured error response.
 */
function formatGETError(message, extra = {}) {
  return {
    success: false,
    error: message,
    name: null,
    email: null,
    message: null,
    ...extra
  }
}

/**
 * Generates a standardized error response for a POST request.
 *
 * The response must always contain success, error, and token fields.
 *
 * @function formatErrorMessage
 * @param {string} message - Error message describing the failure.
 * @param {Object} [extra={}] - Optional additional fields to include in the response.
 * @returns {Object} - Structured error response.
 */
function formatPOSTError(message, extra = {}) {
  return {
    success: false,
    error: message,
    token: null,
    ...extra
  }
}

/**
 * Generates a standardized success response.
 *
 * A successful response must always contain the Message's name, email, and 
 * message fields, so these are explicitly set.
 *
 * @function formatSuccessMessage
 * @param {string} messageDoc - The successfully retrieved Message Mongoose document.
 * @returns {Object} - Structured success response.
 */
function formatSuccessMessage(messageDoc) {
  return {
    success: true,
    error: null,
    name: messageDoc.name,
    email: messageDoc.email,
    message: messageDoc.message
  }
}

module.exports = { formatGETError, formatPOSTError, formatSuccessMessage }