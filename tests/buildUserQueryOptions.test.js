import buildUserQueryOptions from '../utils/buildUserQueryOptions.js'

describe('buildUserQueryOptions', () => {
  test('returns default values when query params are empty', () => {
    const result = buildUserQueryOptions({})

    expect(result).toEqual({
      query: {},
      sortBy: 'user_name',
      limit: 10,
      offset: 0
    })
  })

  test('builds a search query for q', () => {
    const result = buildUserQueryOptions({ q: 'anna' })

    expect(result.query).toEqual({
      $or: [
        { user_name: { $regex: 'anna', $options: 'i' } },
        { slug: { $regex: 'anna', $options: 'i' } }
      ]
    })
  })

  test('builds age gte filter', () => {
    const result = buildUserQueryOptions({
      age: { gte: '18' }
    })

    expect(result.query).toEqual({
      age: { $gte: 18 }
    })
  })

  test('builds age lte filter', () => {
    const result = buildUserQueryOptions({
      age: { lte: '30' }
    })

    expect(result.query).toEqual({
      age: { $lte: 30 }
    })
  })

  test('builds age range filter', () => {
    const result = buildUserQueryOptions({
      age: { gte: '18', lte: '30' }
    })

    expect(result.query).toEqual({
      age: { $gte: 18, $lte: 30 }
    })
  })

  test('ignores invalid age values', () => {
    const result = buildUserQueryOptions({
      age: { gte: 'abc', lte: '' }
    })

    expect(result.query).toEqual({})
  })

  test('uses valid sort_by field', () => {
    const result = buildUserQueryOptions({
      sort_by: '-age'
    })

    expect(result.sortBy).toBe('-age')
  })

  test('falls back to default sort for invalid sort field', () => {
    const result = buildUserQueryOptions({
      sort_by: '-password'
    })

    expect(result.sortBy).toBe('user_name')
  })

  test('uses valid limit and offset', () => {
    const result = buildUserQueryOptions({
      limit: '5',
      offset: '10'
    })

    expect(result.limit).toBe(5)
    expect(result.offset).toBe(10)
  })

  test('falls back to defaults for invalid limit and offset', () => {
    const result = buildUserQueryOptions({
      limit: '-1',
      offset: '-5'
    })

    expect(result.limit).toBe(10)
    expect(result.offset).toBe(0)
  })
})
