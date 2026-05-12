import request from 'supertest'
import app from '../app.js'

describe('Users API', () => {
  test('GET /users/new returns status 200', async () => {
    const response = await request(app).get('/users/new')

    expect(response.status).toBe(200)
  })
})
