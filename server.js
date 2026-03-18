const express = require('express')
const app = express()
const mongoose = require('mongoose')

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
const mongoURI = `mongodb://${DB_HOST}/${DB_NAME}`
mongoose.connect(mongoURI)
const db = mongoose.connection

db.on('error', (error) => console.error('Database connection error:', error))
db.once('open', () => console.log(`Connected to Database: ${DB_NAME} at ${DB_HOST}`))

/**
 * Parse incoming JSON payloads
 */
app.use(express.json())

/**
 * Routes
 */
const messageRouter = require('./src/routes/message')
app.use('/message', messageRouter)

/**
 * Start server
 */
app.listen(SERVER_PORT, SERVER_HOST, () =>
  console.log(`Server started on http://${SERVER_HOST}:${SERVER_PORT}`)
)