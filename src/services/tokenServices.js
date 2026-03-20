const Token = require('../models/tokenModel')
const crypto = require('crypto')
const TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000 // 24 hours
const HttpError = require('../helpers/HttpError')

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
 * Hashes a token using SHA-256.
 *
 * This ensures the raw token is never stored in the database.
 *
 * @function hashToken
 * @param {string} token - The raw token string.
 * @returns {string} - The hashed token.
 */
function hashToken(token) {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')
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
    const hashedToken = hashToken(tokenString)

    const token = new Token({
        // store the hashed token in the database
        token: hashedToken
    })

    await token.save()
    // return the actual token string to the user so it can
    // be passed along for one-time use
    return tokenString
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
    // hash the provided token to compare with database
    const hashedToken = hashToken(providedToken)
    // get the actual token from  the database
    let actualToken
    try {
        actualToken = await Token.findOne({ token: hashedToken })
    } catch (err) {
        throw new HttpError(500, err.message)
    }

    // if the token doesn't exist
    if (!actualToken)
        throw new HttpError(400, "This link could not be found.")

    // if the token has expired (after 24 hours)
    const ageInMs = Date.now() - actualToken.createdAt
    if (ageInMs > TOKEN_EXPIRATION_MS) 
        throw new HttpError(400, "This link has expired.")

    // if the token has already been used
    if (actualToken.used)
        throw new HttpError(400, "This link has already been used.")

    // if none of the errors obtain, mark token as used
    actualToken.used = true
    try {
        await actualToken.save()
    } catch (err) {
        throw new HttpError(500, err.message)
    }

    return { 
        success: true,
        token: actualToken
    }
}

// we want to export hashToken because we need to use it in message.js
// when storing a Message's token in the database
module.exports = { hashToken, createToken, validateToken }