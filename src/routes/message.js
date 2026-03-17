const express = require('express')
const router = express.Router()
const { createToken, validateToken } = require('../helpers/tokenHelpers')
const Message = require('../models/messageModel')
const Token = require('../models/tokenModel')

// Getting all
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find()
        res.json(messages)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

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
router.get('/:token', async (req, res) => {
    const providedToken = req.params.token

    // validate the token (this handles the errors)
    const validToken = await validateToken(providedToken)
    if (!validToken.success){
        return res.status(400).json(validToken)
    }

    // we'll only get here if the token exists
    // validToken.token retrieves the token object, the additional
    // .token retrieves the actual token ID
    try {
        message = await Message.findOne({ token: validToken.token.token })
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message,
            name: null,
            email: null,
            message: null 
        })
    }

    res.status(201).json({
        success: true,
        error: null,
        name: message.name,
        email: message.email,
        message: message.message
    })
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
router.post('/', async (req, res) => {
    let token 
    try {
        token = await createToken()
    } catch (err) {
        return res.status(500).json({ 
            success: false,
            error: err.message,
            token: null
        })
    }

    const message = new Message({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        token
    })

    // wrap in a try-catch because the .save() method is async
    try {
        await message.save()
        // status 201 to indicate the successful creation of a message
        res.status(201).json({
            success: true,
            error: null,
            token
        })
    } catch (err) {
        // 400 error to indicate bad user input
        res.status(400).json({ 
            success: false,
            error: err.message,
            token: null
        })
    }
})

module.exports = router