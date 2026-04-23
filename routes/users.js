import express from 'express'
import {
  createUser,
  getNewUserForm,
  listUsers,
  showUser,
  editUserForm,
  updateUser,
  deleteUser
} from '../controllers/userController.js'

const router = express.Router()

router.post('/', createUser)
router.get('/new', getNewUserForm)
router.get('/', listUsers)
router.get('/:slug', showUser)
router.get('/:slug/edit', editUserForm)
router.post('/:slug', updateUser)
router.get('/:slug/delete', deleteUser)

export default router
