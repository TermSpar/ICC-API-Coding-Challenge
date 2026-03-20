/**
 * Token Model
 *
 * Stores one-time use tokens used to retrieve messages.
 * 
 * Fields:
 * - token (String): The unique token string.
 * - createdAt (Date): The date at which the token was created.
 * - used (Boolean): Whether the token has been used.
 * 
 * Note: 
 * - expiration logic is handled in the token validation helper.
 */

const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    /**
     * Unique token string used for message retrieval.
     * @type {String}
     * @unique
     */
    token: {
        type: String,
        unique: true
    },
    /**
     * Date at which the token was created, to ensure that
     * it expires after 24-hours (handled in tokenServices.js).
     * @type {Date}
     * @default Date.now
     */
    createdAt: {
        type: Date,
        default: Date.now,
    },
    /**
     * Boolean to ensure that each token is used only once.
     * @type {Boolean}
     * @default false
     */
    used: {
        type: Boolean,
        default: false 
    }
})

module.exports = mongoose.model('Token', tokenSchema)