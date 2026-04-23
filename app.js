import express from 'express'
import userRoutes from './routes/users.js'
import errorHandler from './middleware/errorHandler.js'

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


const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use('/users', userRoutes)


export default app
