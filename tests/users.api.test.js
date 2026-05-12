import request from 'supertest'
import app from '../app.js'

describe('Users API', () => {
  test('GET /users returns status 200', async () => {
    const response = await request(app).get('/users')

    expect(response.status).toBe(200)
  })
})
