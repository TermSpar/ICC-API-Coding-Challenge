const express = require('express')
const app = express()
const mongoose = require('mongoose')

/**
 * Connect to MongoDB
 * Database: `bollinger-test` on localhost
 */
mongoose.connect('mongodb://localhost/bollinger-test')
const db = mongoose.connection

// Log database connection errors
db.on('error', (error) => console.error(error))

// Log successful database connection
db.once('open', () => console.log('Connected to Database'))

/**
 * Parse incoming JSON payloads
 */
app.use(express.json())

/**
 * Route: Messages API: /message
 */
const messageRouter = require('./routes/message')
app.use('/message', messageRouter)

/**
 * Start Server on port 3000
 */
const PORT = 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))