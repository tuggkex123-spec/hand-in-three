import { jest } from '@jest/globals'
import request from 'supertest'

const mockFind = jest.fn()
const mockCountDocuments = jest.fn()

jest.unstable_mockModule('../models/users.js', () => ({
  default: {
    find: mockFind,
    countDocuments: mockCountDocuments
  }
}))

const { default: app } = await import('../app.js')

describe('Users API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('GET /users returns status 200', async () => {
    const mockQueryChain = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([
        { user_name: 'Anna', slug: 'anna', age: 25 },
        { user_name: 'Bob', slug: 'bob', age: 30 }
      ])
    }

    mockFind.mockReturnValue(mockQueryChain)
    mockCountDocuments.mockResolvedValue(2)

    const response = await request(app).get('/users')

    expect(response.status).toBe(200)
    expect(mockFind).toHaveBeenCalled()
    expect(mockCountDocuments).toHaveBeenCalled()
  })
})
