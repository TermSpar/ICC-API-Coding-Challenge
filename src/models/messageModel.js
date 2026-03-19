/**
 * Message Model
 *
 * Stores user-submitted messages along with their attached names
 * and emails. It also stores the one-time token that allows 
 * retrieving the message later.
 *
 * Fields:
 * - success (Boolean): 
 * - error (String):
 * - name (String): Name of the person submitting the message.
 * - email (String): Email address of the person.
 * - message (String): The message content.
 * - token (String): One-time token associated with the message.
 */

const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    /**
     * Indicates whether the message was successfully created.
     * @type {Boolean}
     */
    success: {
        type: Boolean
    },
    /**
     * Provides error message, if any.
     * @type {String}
     */
    error: {
        type: String
    },
    /**
     * Name attached to the message.
     * @type {String}
     * @required
     */
    name: {
        type: String,
        required: [true, "Name is required"],
        maxlength: [100, "Name cannot exceed 100 characters"]
    },
    /**
     * Email attached to the message.
     * @type {String}
     * @required
     */
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please use a valid email address (e.g. ben@example.com)'
        ],
        maxlength: [100, "Email cannot exceed 100 characters"]
    },
    /**
     * The message.
     * @type {String}
     * @required
     */
    message: {
        type: String,
        required: [true, "Message is required"],
        maxlength: [250, "Message cannot exceed 250 characters"]
    },
    /**
     * Token attached to the message.
     * @type {String}
     */
    token: {
        type: String,
    }
})

module.exports = mongoose.model('Message', messageSchema)