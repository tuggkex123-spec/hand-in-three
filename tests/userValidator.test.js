import { validateUserInput } from '../validators/userValidator.js'

describe('validateUserInput', () => {
  test('returns valid for correct input', () => {
    const result = validateUserInput({
      slug: 'anna-smith',
      user_name: 'Anna Smith',
      age: 25
    })

    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual([])
  })

  test('rejects missing slug', () => {
    const result = validateUserInput({
      user_name: 'Anna Smith',
      age: 25
    })

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Slug is required.')
  })

  test('rejects invalid slug format', () => {
    const result = validateUserInput({
      slug: 'hajpådaj',
      user_name: 'Anna Smith',
      age: 25
    })

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'Slug must contain only lowercase letters, numbers, and hyphens.'
    )
  })

  test('rejects missing user_name', () => {
    const result = validateUserInput({
      slug: 'anna-smith',
      age: 25
    })

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('User name is required.')
  })

  test('rejects non-integer age', () => {
    const result = validateUserInput({
      slug: 'anna-smith',
      user_name: 'Anna Smith',
      age: '25.5'
    })

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Age must be a whole number.')
  })

  test('rejects missing age', () => {
    const result = validateUserInput({
      slug: 'anna-smith',
      user_name: 'Anna Smith'
    })

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Age must be a whole number.')
  })
})
