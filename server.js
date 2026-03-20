require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { formatPOSTError, formatGETError } = require('./src/helpers/responseHelpers')
const HttpError = require('./src/helpers/HttpError')

/**
 * Environment variables with defaults
 */
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_NAME = process.env.DB_NAME || 'bollinger-test'
const SERVER_HOST = process.env.SERVER_HOST || 'localhost'
const SERVER_PORT = process.env.SERVER_PORT || 3000

/**
 * Connect to MongoDB
 */
if (require.main === module) {
  const mongoURI = `mongodb://${DB_HOST}/${DB_NAME}`
  mongoose.connect(mongoURI)
  const db = mongoose.connection

  db.on('error', (error) => console.error('Database connection error:', error))
  db.once('open', () => console.log(`Connected to Database: ${DB_NAME} at ${DB_HOST}`))
}

/**
 * Parse incoming JSON payloads
 */
app.use(express.json())


/**
 * Handle JSON syntax errors
 */
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json(formatErrorMessage("Invalid JSON format"))
  }
  next()
})

/**
 * Routes
 */
const messageRouter = require('./src/routes/message')
app.use('/message', messageRouter)

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error(err)

  // Distinguish between GET and POST errors

  if (req.method == "GET") {
    // Custom HttpError
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json(formatGETError(err.message))
    }

    // Mongoose validation errors
    // This will only obtain on GET requests
    if (err.name === 'ValidationError') {
      return res.status(400).json(
        formatGETError(err.message || "Internal Server Error", {
          token: null
        })
      )
    }

    // Fallback
    return res.status(500).json(
        formatGETError(err.message || "Internal Server Error")
      )
  }

  if (req.method == "POST"){
    return res.status(500).json(
        formatPOSTError(err.message || "Internal Server Error")
      )
  }
})

app.use((req, res) => {
  res.status(404).json(formatGETMessage(`Route '${req.originalUrl}' not found`, {
    suggestion: "Try '/message'"
  }))
})

/**
 * Start server (export for testing purposes)
 */
module.exports = app

if (require.main === module) {
  app.listen(SERVER_PORT, SERVER_HOST, () =>
    console.log(`Server started on http://${SERVER_HOST}:${SERVER_PORT}`)
  )
}