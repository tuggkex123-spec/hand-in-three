import User from '../models/User.js'
import { validateUserInput } from '../validators/userValidator.js'
import AppError from '../utils/AppError.js'

export async function createUser(req, res, next) {
  const result = validateUserInput(req.body)

  if (!result.isValid) {
    return res.status(400).send(result.errors.join(' '))
  }

  try {
    const user = new User(req.body)
    await user.save()
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}
