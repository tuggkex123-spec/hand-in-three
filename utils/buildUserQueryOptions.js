export default function buildUserQueryOptions(queryParams) {
  const query = {}


  if (queryParams.q && queryParams.q.trim() !== '') {
    query.$or = [
      { user_name: { $regex: queryParams.q.trim(), $options: 'i' } },
      { slug: { $regex: queryParams.q.trim(), $options: 'i' } }
    ]
  }

 
  if (queryParams.age) {
    query.age = {}

    if (queryParams.age.gte !== undefined && queryParams.age.gte !== '') {
      const minAge = Number(queryParams.age.gte)
      if (!Number.isNaN(minAge)) {
        query.age.$gte = minAge
      }
    }

    if (queryParams.age.lte !== undefined && queryParams.age.lte !== '') {
      const maxAge = Number(queryParams.age.lte)
      if (!Number.isNaN(maxAge)) {
        query.age.$lte = maxAge
      }
    }

    if (Object.keys(query.age).length === 0) {
      delete query.age
    }
  }


  const allowedSortFields = ['user_name', 'slug', 'age']
  let sortBy = 'user_name'

  if (
    queryParams.sort_by &&
    allowedSortFields.includes(queryParams.sort_by.replace('-', ''))
  ) {
    sortBy = queryParams.sort_by
  }


  let limit = Number(queryParams.limit)
  let offset = Number(queryParams.offset)

  if (Number.isNaN(limit) || limit <= 0) {
    limit = 10
  }

  if (Number.isNaN(offset) || offset < 0) {
    offset = 0
  }

  return {
    query,
    sortBy,
    limit,
    offset
  }
}
