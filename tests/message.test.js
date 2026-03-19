// tests/message.test.js

/**
 * Mocked services
 */

// Mock token helpers
jest.mock('../src/helpers/tokenHelpers', () => ({
  hashToken: jest.fn((t) => `hashed-${t}`),
  createToken: jest.fn(),
  validateToken: jest.fn()
}))

// Mock Message model
jest.mock('../src/models/messageModel', () => {
  const saveMessageMock = jest.fn()
  const findOneMessageMock = jest.fn()

  const MessageMock = jest.fn().mockImplementation(() => ({
    save: saveMessageMock
  }))

  MessageMock.findOne = findOneMessageMock

  // Exposed mocks, accessible by tests
  MessageMock.__mocks__ = {
    saveMessageMock,
    findOneMessageMock
  }

  return MessageMock
})

// Mock Token model
jest.mock('../src/models/tokenModel', () => {
  const saveTokenMock = jest.fn()
  const findOneTokenMock = jest.fn()

  const TokenMock = jest.fn().mockImplementation(() => ({
    save: saveTokenMock
  }))

  TokenMock.findOne = findOneTokenMock

  // Exposed mocks, accessible by tests
  TokenMock.__mocks__ = {
    saveTokenMock,
    findOneTokenMock
  }

  return TokenMock
})

// Imports after mocks
const request = require('supertest')
const express = require('express')
const router = require('../src/routes/message')

const { hashToken, createToken, validateToken } = require('../src/helpers/tokenHelpers')
const Message = require('../src/models/messageModel')
const Token = require('../src/models/tokenModel')

// Extract mocks
const { saveMessageMock, findOneMessageMock } = Message.__mocks__
const { saveTokenMock, findOneTokenMock } = Token.__mocks__

// Setup a test express.js app
const app = express()
app.use(express.json())
app.use('/message', router)

/** 
  Message API tests
**/
describe('Message API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /message', () => {
    it('should create a message successfully, provide proper response', async () => {
      // Mock the async functions
      createToken.mockResolvedValue('bens-token')
      saveMessageMock.mockResolvedValue(true)

      // Send a POST request
      const res = await request(app)
        .post('/message')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Ben',
          email: 'ben@example.com',
          message: 'Hello world'
        })

      // Successful creation status
      expect(res.status).toBe(201)

      // Correct return data
      expect(res.body).toEqual({
        success: true,
        error: null,
        token: 'bens-token'
      })

      // Ensure hashToken() and Message.save() were called
      expect(hashToken).toHaveBeenCalledWith('bens-token')
      expect(saveMessageMock).toHaveBeenCalled()
    })
  })

  describe('GET /message:token', () => {
    it('should successfully retrieve email, name, and message from a given token', async () => {
      // Mock the async functions
      validateToken.mockResolvedValue({
        success: true,
        token: { token: "bens-hashed-token" }
      })
      findOneMessageMock.mockResolvedValue({
        name: "Ben",
        email: "ben@test.com",
        message: "This is Ben's message... hi!"
      })

      // Send a GET request
      const res = await request(app).get('/message/bens-token')

      // Successful creation status
      expect(res.status).toBe(200)

      // Correct return data
      expect(res.body).toEqual({
        success: true,
        error: null,
        name: "Ben",
        email: "ben@test.com",
        message: "This is Ben's message... hi!" 
      })
    })
  })
})