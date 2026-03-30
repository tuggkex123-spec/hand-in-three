import express from 'express'
import mongoose from 'mongoose'

const app = express()
const PORT = 3000

app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs')


mongoose.connect('mongodb://127.0.0.1:27017/admin')
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error))

app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`)
})

const userSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  user_name: { type: String, unique: true, required: true },
  age: { type: String, unique: true, required: true }, 
})

const User = mongoose.model('User', userSchema)

app.post('/users', async (request, response) => {
  try {
    const user = new User({
      slug: request.body.slug,
      user_name: request.body.user_name,
      age: request.body.age
  })
  await user.save()

    response.send('User Created')
  }catch (error) {
    console.error(error)
    response.send('Error: The user could not be created.')
  }
})

app.get('/users/new', (request, response) => {
  response.render('users/new')
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({})  // get all users from MongoDB
    res.render('users/index', {
      users: users
    })
  } catch (error) {
    console.error(error)
    res.send('Error fetching users')
  }
})

app.get('/users/:slug', async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug })
    if (!user) {
      return res.status(404).send('User not found')
    }

    res.render('users/show', { user })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching user')
  }
})
