import express from 'express'
import userRoutes from './routes/users.js'

import User from './models/User.js'

app.get('/', async (req, res) => {
  try {
    const userCount = await User.countDocuments()
    res.render('index', { userCount })
  } catch (error) {
    console.error(error)
    res.render('index', { userCount: 0 })
  }
})

import errorHandler from './middleware/errorHandler.js'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use('/users', userRoutes)
app.use(errorHandler)

export default app
