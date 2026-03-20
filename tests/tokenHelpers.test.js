// tests/tokenHelpers.test.js

/**
 * Mocked services
 */

// Mock Token model
jest.mock('../src/models/tokenModel', () => {
  const saveTokenMock = jest.fn()
  const findOneMock = jest.fn()

  const TokenMock = jest.fn().mockImplementation((data) => ({
    ...data,
    save: saveTokenMock
  }))

  TokenMock.findOne = findOneMock

  TokenMock.__mocks__ = {
    saveTokenMock,
    findOneMock
  }

  return TokenMock
})

const crypto = require('crypto')
const Token = require('../src/models/tokenModel')
const {
  hashToken,
  createToken,
  validateToken
} = require('../src/services/tokenHelpers')

const { saveTokenMock, findOneMock } = Token.__mocks__

/** 
* Token helper tests
**/
describe('Token Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  /**
   * hashToken() tests
   */
  describe('hashToken', () => {
    it('should hash a token using SHA-256', () => {
      const token = 'bens-token'
      const expected = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')

      // Ensure that the token is hashed properly
      expect(hashToken(token)).toBe(expected)
    })
  })

  /**
   * createToken() tests
   */
  describe('createToken', () => {
    it('should create and save a token, returning the actual token string', async () => {
      saveTokenMock.mockResolvedValue(true)

      const token = await createToken()

      // Ensure that a token string is generated
      expect(typeof token).toBe('string')
      // Ensure that the token is 64 hex characters
      expect(token.length).toBe(64)
      // Ensure that Token.save() was called
      expect(saveTokenMock).toHaveBeenCalled()
    })

    it('should throw an error if Token.save() fails', async () => {
      saveTokenMock.mockRejectedValue(new Error('DB error'))

      await expect(createToken()).rejects.toThrow('DB error')
    })
  })

  /**
   * validateToken() tests
   */
  describe('validateToken', () => {
    it('should return an error message if the token is not found', async () => {
      findOneMock.mockResolvedValue(null)

      await expect(validateToken('bens-bad-token')).rejects.toThrow(
        'This link could not be found.'
      )
    })

    it('should return an error message Token.findOne() fails', async () => {
      findOneMock.mockRejectedValue(new Error('Token.findOne() error'))

      await expect(validateToken('bens-failed-token')).rejects.toThrow(
        'Token.findOne() error'
      )
    })

    it('should return an error message if the token expired after 24 hours', async () => {
      // Set to 25 hours ago
      const oldDate = Date.now() - (25 * 60 * 60 * 1000) 

      findOneMock.mockResolvedValue({
        createdAt: oldDate,
        used: false
      })

      await expect(validateToken('bens-expired-token')).rejects.toThrow(
        'This link has expired.'
      )
    })

    it('should return an error message if the token is already used', async () => {
      findOneMock.mockResolvedValue({
        createdAt: Date.now(),
        used: true
      })

      await expect(validateToken('bens-used-token')).rejects.toThrow(
        'This link has already been used.'
      )
    })

    it('should validate the valid token and mark as used', async () => {
      const save = jest.fn().mockResolvedValue(true)

      const tokenObj = {
        createdAt: Date.now(),
        used: false,
        save
      }

      findOneMock.mockResolvedValue(tokenObj)

      const res = await validateToken('bens-valid-token')

      // Ensure its success
      expect(res.success).toBe(true)
      expect(tokenObj.used).toBe(true)
      expect(save).toHaveBeenCalled()
    })

    it('should return an error message if saving the used token fails', async () => {
      const tokenObj = {
        createdAt: Date.now(),
        used: false,
        save: jest.fn().mockRejectedValue(new Error('Save failed'))
      }

      findOneMock.mockResolvedValue(tokenObj)

      await expect(validateToken('bens-valid-token')).rejects.toThrow(
        'Save failed'
      )
    })
  })
})