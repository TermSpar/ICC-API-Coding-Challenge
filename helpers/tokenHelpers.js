const Token = require('../models/tokenModel')
const crypto = require('crypto')
const TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Generates a cryptographically secure random token (i.e. it is 
 * statistically improbable that this token could be replicated).
 *
 * The token is 256 bits (32 bytes) and encoded as a 64-character 
 * hexadecimal string.
 *
 * @returns {string} - A randomly generated token string.
 */
function generateToken() {
    return crypto.randomBytes(32).toString('hex') 
}

/**
 * Creates a token object (according to the tokenSchema in 
 * tokenModel.js) and stores it in a database.
 * 
 *
 * This function creates a token, stores it in the Token collection, 
 * and then returns the token string so it can be used in a message.
 * 
 * This function is async because the.save() function 
 * on a Mongoose Schema object such as Token is an asynchronous 
 * process, i.e. it must be waited upon before the program can 
 * continue.
 *
 * @async
 * @function createToken
 * @returns {string} - The generated token string.
 */
async function createToken() {
    const tokenString = generateToken()
    
    const token = new Token({
        token: tokenString
    })

    await token.save()
    return tokenString
}

/**
 * Generates a standardized error response for token validation.
 *
 * The response must always contain name, email, and message fields
 * so they are explicitly set to null when an error occurs. The error
 * field is also set to whatever message is specified.
 *
 * @function tokenError
 * @param {string} message - Error message describing the failure.
 * @returns {Object} - Structured error response.
 */
function tokenError(errorMessage) {
    return {
        success: false,
        error: errorMessage,
        name: null,
        email: null,
        message: null
    }
}

/**
 * Determines whether a provided token is valid.
 *
 * Validation steps:
 * 1. Confirm the token exists.
 * 2. Ensure the token has not already been used.
 * 3. Ensure the token has not expired (24 hour limit).
 * 4. If valid, mark the token as used to enforce one-time use.
 *
 * If validation fails, a standardized tokenError() is returned.
 *
 * @async
 * @function validateToken
 * @param {string} providedToken - The token supplied by the user.
 * @returns {Promise<Object>} -
 * Returns an object containing:
 * - success (boolean).
 * - standardized tokenError() if validation fails.
 * - validated token object if validation succeeds.
 */
async function validateToken(providedToken) {
    // get the actual token
    const actualToken = await Token.findOne({ token: providedToken })

    // if the token doesn't exist
    if (!actualToken)
        return tokenError("This link could not be found.")

    // if the token has already been used
    if (actualToken.used)
        return tokenError("This link has already been used.")

    // if the token has expired (after 24 hours)
    const ageInMs = Date.now() - actualToken.createdAt
    if (ageInMs > TOKEN_EXPIRATION_MS) 
        return tokenError("This link has expired.")

    // if none of the errors obtain, mark token as used
    actualToken.used = true
    await actualToken.save()

    return { 
        success: true,
        token: actualToken
    }
}

module.exports = { createToken, validateToken }