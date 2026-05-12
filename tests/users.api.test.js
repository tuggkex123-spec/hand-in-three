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
    const mockSort = jest.fn().mockReturnThis()
    const mockSkip = jest.fn().mockReturnThis()
    const mockLimit = jest.fn().mockResolvedValue([
      { user_name: 'Anna', slug: 'anna', age: 25 },
      { user_name: 'Bob', slug: 'bob', age: 30 }
    ])

    mockFind.mockReturnValue({
      sort: mockSort,
      skip: mockSkip,
      limit: mockLimit
    })

    mockCountDocuments.mockResolvedValue(2)

    const response = await request(app).get('/users')

    expect(response.status).toBe(200)
    expect(mockFind).toHaveBeenCalledWith({})
    expect(mockSort).toHaveBeenCalledWith('user_name')
    expect(mockSkip).toHaveBeenCalledWith(0)
    expect(mockLimit).toHaveBeenCalledWith(10)
    expect(mockCountDocuments).toHaveBeenCalledWith({})
  })

  test('GET /users with filters builds the correct query', async () => {
    const mockSort = jest.fn().mockReturnThis()
    const mockSkip = jest.fn().mockReturnThis()
    const mockLimit = jest.fn().mockResolvedValue([
      { user_name: 'Anna', slug: 'anna', age: 25 }
    ])

    mockFind.mockReturnValue({
      sort: mockSort,
      skip: mockSkip,
      limit: mockLimit
    })

    mockCountDocuments.mockResolvedValue(1)

    const response = await request(app).get(
      '/users?q=anna&age[gte]=18&age[lte]=30&sort_by=-age&limit=5&offset=10'
    )

    expect(response.status).toBe(200)

    expect(mockFind).toHaveBeenCalledWith({
      $or: [
        { user_name: { $regex: 'anna', $options: 'i' } },
        { slug: { $regex: 'anna', $options: 'i' } }
      ],
      age: {
        $gte: 18,
        $lte: 30
      }
    })

    expect(mockSort).toHaveBeenCalledWith('-age')
    expect(mockSkip).toHaveBeenCalledWith(10)
    expect(mockLimit).toHaveBeenCalledWith(5)

    expect(mockCountDocuments).toHaveBeenCalledWith({
      $or: [
        { user_name: { $regex: 'anna', $options: 'i' } },
        { slug: { $regex: 'anna', $options: 'i' } }
      ],
      age: {
        $gte: 18,
        $lte: 30
      }
    })
  })
})
