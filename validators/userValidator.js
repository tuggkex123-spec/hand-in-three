export function validateUserInput(input) {
  const errors = []

  if (!input.slug || typeof input.slug !== 'string') {
    errors.push('Slug is required.')
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens.')
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

