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
    const users = await User.find({})
    res.render('users/index', { users })
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
