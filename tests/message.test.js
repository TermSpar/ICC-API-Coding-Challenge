// tests/message.test.js

/**
 * Mocked services
 */

// Mock token helpers
jest.mock('../src/services/tokenHelpers', () => ({
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

const { hashToken, createToken, validateToken } = require('../src/services/tokenHelpers')
const Message = require('../src/models/messageModel')

// Extract mocks
const { saveMessageMock, findOneMessageMock } = Message.__mocks__

// Setup a test express.js app
const app = require('../server')

/** 
* Message API tests
**/
describe('Message API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  /** 
  * POST tests
  **/
  describe('POST /message', () => {
    it('should create a message successfully given valid input', async () => {
      // Mock the async functions
      createToken.mockResolvedValue('bens-token')
      saveMessageMock.mockResolvedValue(true)

      // Send a POST request
      const res = await request(app)
        .post('/message')
        .set('Content-Type', 'application/json')
        .send({
          name: 'Ben',
          email: 'ben@test.com',
          message: 'This is Ben\'s test message... hi!'
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

    it('should return error status 500 if token creation fails', async () => {
      // Mock a token creation failure
      createToken.mockRejectedValue(new Error('Token creation failed'))

      // POST it
      const res = await request(app)
        .post('/message')
        .send({
          name: 'Ben',
          email: 'ben@test.com',
          message: 'This is Ben\'s test message... hi!'
        })

      // Ensure the correct 500 error status is returned
      expect(res.status).toBe(500)
      // Ensure the success and token fields are there, but null
      expect(res.body.success).toBe(false)
      expect(res.body.token).toBeNull()
    })

    it('should return error status 500 if token save fails', async () => {
      // Mock successful token creation, but failed message save
      createToken.mockResolvedValue('bens-token')
      saveMessageMock.mockRejectedValue(new Error('Token save failed'))

      const res = await request(app)
        .post('/message')
        .send({
          name: 'Ben',
          email: 'ben@test.com',
          message: 'This is Ben\'s test message... hi!'
        })

      // Ensure the correct 500 error status is returned
      expect(res.status).toBe(500)
      // Ensure the success and token fields are there, but null
      expect(res.body.success).toBe(false)
      expect(res.body.token).toBeNull()
    })
  })

  /** 
  * GET tests
  **/
  describe('GET /message:token', () => {
    it('should successfully retrieve email, name, and message from a valid token', async () => {
      // Mock the async functions
      validateToken.mockResolvedValue({
        success: true,
        token: { token: 'bens-hashed-token' }
      })
      findOneMessageMock.mockResolvedValue({
        name: 'Ben',
        email: 'ben@test.com',
        message: 'This is Ben\'s test message... hi!'
      })

      // Send a GET request
      const res = await request(app).get('/message/bens-token')

      // Successful creation status
      expect(res.status).toBe(200)

      // Correct return data
      expect(res.body).toEqual({
        success: true,
        error: null,
        name: 'Ben',
        email: 'ben@test.com',
        message: 'This is Ben\'s test message... hi!' 
      })
    })
  })

  /** 
  * Unsupported methods tests
  **/
  describe('Unsupported methods', () => {
    it('should return 405 for PUT on /message', async () => {
      // Attempt a PUT request
      const res = await request(app).put('/message')

      // Expect error status 405
      expect(res.status).toBe(405)
      expect(res.body.success).toBe(false)
    })

    it('should return 405 for DELETE on /message/:token', async () => {
      // Attempt a DELETE request
      const res = await request(app).delete('/message/bens-token')

      // Expect error status 405
      expect(res.status).toBe(405)
      expect(res.body.success).toBe(false)
    })
  })
})