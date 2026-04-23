export function validateUserInput(input) {
  const errors = []

  if (!input.slug || typeof input.slug !== 'string') {
    errors.push('Slug is required.')
  }

  if (!input.user_name || typeof input.user_name !== 'string') {
    errors.push('User name is required.')
  }

  const age = Number(input.age)
  if (!Number.isInteger(age)) {
    errors.push('Age must be a whole number.')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
