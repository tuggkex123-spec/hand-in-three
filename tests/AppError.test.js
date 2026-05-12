import AppError from '../utils/AppError.js'

describe('AppError', () => {
  test('creates an error with message and statusCode', () => {
    const error = new AppError('User not found', 404)

    expect(error.message).toBe('User not found')
    expect(error.statusCode).toBe(404)
    expect(error.name).toBe('AppError')
  })

  test('uses 500 as the default statusCode', () => {
    const error = new AppError('Something went wrong')

    expect(error.message).toBe('Something went wrong')
    expect(error.statusCode).toBe(500)
    expect(error.name).toBe('AppError')
  })

  test('is an instance of Error', () => {
    const error = new AppError('Test error', 400)

    expect(error instanceof Error).toBe(true)
    expect(error instanceof AppError).toBe(true)
  })
})
