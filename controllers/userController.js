import User from '../models/users.js'
import { validateUserInput } from '../validators/userValidator.js'
import AppError from '../utils/AppError.js'

export async function createUser(req, res, next) {
  const result = validateUserInput(req.body)

  if (!result.isValid) {
    return res.status(400).send(result.errors.join(' '))
  }

  try {
    const user = new User({
      slug: req.body.slug,
      user_name: req.body.user_name,
      age: Number(req.body.age)
    })

    await user.save()
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}

export function getNewUserForm(req, res) {
  res.render('users/new')
}

export async function listUsers(req, res, next) {
  try {
    const query = {}

    // Search by user_name or slug
    if (req.query.q && req.query.q.trim() !== '') {
      query.$or = [
        { user_name: { $regex: req.query.q.trim(), $options: 'i' } },
        { slug: { $regex: req.query.q.trim(), $options: 'i' } }
      ]
    }

    // Age filtering with LHS brackets: age[gte], age[lte]
    if (req.query.age) {
      query.age = {}

      if (req.query.age.gte !== undefined && req.query.age.gte !== '') {
        const minAge = Number(req.query.age.gte)
        if (!Number.isNaN(minAge)) {
          query.age.$gte = minAge
        }
      }

      if (req.query.age.lte !== undefined && req.query.age.lte !== '') {
        const maxAge = Number(req.query.age.lte)
        if (!Number.isNaN(maxAge)) {
          query.age.$lte = maxAge
        }
      }

      // Remove empty age object if nothing valid was added
      if (Object.keys(query.age).length === 0) {
        delete query.age
      }
    }

    // Allowed sort fields
    const allowedSortFields = ['user_name', 'slug', 'age']
    let sortBy = 'user_name'

    if (req.query.sort_by && allowedSortFields.includes(req.query.sort_by.replace('-', ''))) {
      sortBy = req.query.sort_by
    }

    // Pagination
    let limit = Number(req.query.limit)
    let offset = Number(req.query.offset)

    if (Number.isNaN(limit) || limit <= 0) {
      limit = 10
    }

    if (Number.isNaN(offset) || offset < 0) {
      offset = 0
    }

    const users = await User.find(query)
      .sort(sortBy)
      .skip(offset)
      .limit(limit)

    const totalUsers = await User.countDocuments(query)

    res.render('users/index', {
      users,
      filters: {
        q: req.query.q || '',
        ageGte: req.query.age?.gte || '',
        ageLte: req.query.age?.lte || '',
        sort_by: sortBy,
        limit,
        offset
      },
      pagination: {
        total: totalUsers,
        limit,
        offset,
        hasNextPage: offset + limit < totalUsers,
        hasPrevPage: offset > 0,
        nextOffset: offset + limit,
        prevOffset: Math.max(offset - limit, 0)
      }
    })
  } catch (error) {
    next(error)
  }
}


export async function showUser(req, res, next) {
  try {
    const user = await User.findOne({ slug: req.params.slug })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.render('users/show', { user })
  } catch (error) {
    next(error)
  }
}

export async function editUserForm(req, res, next) {
  try {
    const user = await User.findOne({ slug: req.params.slug })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.render('users/edit', { user })
  } catch (error) {
    next(error)
  }
}

export async function updateUser(req, res, next) {
  const result = validateUserInput(req.body)

  if (!result.isValid) {
    return res.status(400).send(result.errors.join(' '))
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { slug: req.params.slug },
      {
        slug: req.body.slug,
        user_name: req.body.user_name,
        age: Number(req.body.age)
      },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      throw new AppError('User not found', 404)
    }

    res.redirect(`/users/${updatedUser.slug}`)
  } catch (error) {
    next(error)
  }
}

export async function deleteUser(req, res, next) {
  try {
    const deletedUser = await User.findOneAndDelete({ slug: req.params.slug })

    if (!deletedUser) {
      throw new AppError('User not found', 404)
    }

    res.redirect('/users')
  } catch (error) {
    next(error)
  }
}
