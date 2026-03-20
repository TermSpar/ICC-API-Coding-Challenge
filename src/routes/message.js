const express = require('express')
const router = express.Router()
const { hashToken, createToken, validateToken } = require('../services/tokenHelpers')
const Message = require('../models/messageModel')
const asyncHandler = require('../helpers/asyncHandler')
const HttpError = require('../helpers/HttpError')
const { formatGETError, formatPOSTError, formatSuccessMessage } = require('../helpers/responseHelpers')

function isValidTokenFormat(token) {
  return /^[a-f0-9]{64}$/.test(token)
}

/**
 * GET /:token
 *
 * Retrieves a message using a one-time token as the link.
 * The token is validated and marked as used before the message is 
 * returned.
 *
 * Exception handling by validateToken():
 * - Token does not exist
 * - Token already used
 * - Token expired
 *
 * @async
 * @route GET /message/:token
 * @param {string} req.params.token - One-time use token
 * @returns {Object} Message data if token is valid
 */
router.route('/:token')
    // Note: asyncHandler will take care of 500 errors 
    // (i.e. no need for a try-catch)
    .get(asyncHandler(async (req, res) => {
        const providedToken = req.params.token

        // validateToken() handles validation (i.e. 400) errors
        const validToken = await validateToken(providedToken)

        // We will only get here if the token exists
        // validToken.token retrieves the token object, the additional
        // .token retrieves the actual token ID
        const message = await Message.findOne({ 
            token: validToken.token.token 
        })

        // Status code 200 to indicate a successful retrieval
        res.status(200).json(formatSuccessMessage(message))
    }))
    .all((req, res) => {
      // Block any unsupported HTTP methods
      return res.status(405).json(formatGETError(`${req.method} not allowed on this link`))
    })

/**
 * POST /
 *
 * Creates a message that is attached to an email and a name, which
 * can be later accessed only once by a generated token.
 * 
 * Request body:
 * {
 *   name: string,
 *   email: string,
 *   message: string
 * }
 * 
 * Exception handling:
 * - Errors will be caught and returned as a 400 error.
 *
 * @async
 * @route POST /message
 * @param {string} req.params.token - One-time use token
 * @returns {Object} Data concerning whether or not message creation 
 * was a success.
 */
router.route('/')
    // Note: asyncHandler will take care of 500 errors 
    // (i.e. no need for a try-catch)
    .post(asyncHandler(async (req, res) => { 
        const token = await createToken()

        const message = new Message({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
            token: hashToken(token)
        })

        await message.save()
        // status 201 to indicate the successful creation of a message
        res.status(201).json({
            success: true,
            error: null,
            token
        })
    }))
    .all((req, res) => {
      // Block any unsupported HTTP methods
      return res.status(405).json(formatPOSTError(`${req.method} not allowed on this link`))
    })

module.exports = router