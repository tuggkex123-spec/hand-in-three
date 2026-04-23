import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'

const app = express()


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs')

console.log('MONGODB_URI:', process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error))

app.listen(process.env.PORT, () => {
  console.log(`👋 Started server on port ${process.env.PORT}`)
})

const userSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  },
  user_name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    match: /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 130
  }
})

function validateUserInput(input) {
  const errors = []

  if (!input.slug || typeof input.slug !== 'string') {
    errors.push('Slug is required.')
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
    errors: errors
  }
}

const User = mongoose.model('User', userSchema)


app.post('/users', async (request, response) => {
  const result = validateUserInput(request.body)

  if (!result.isValid) {
    return response.send(result.errors.join(' '))
  }
  
  try {
    const user = new User({
      slug: request.body.slug,
      user_name: request.body.user_name,
      age: request.body.age
  })
  await user.save()

    response.redirect('/')
  }catch (error) {
    console.error(error)
    response.send('Error: The user could not be created.')
  }
})

app.get('/users/new', (request, response) => {
  response.render('users/new')
})

app.get('/users', async (request, response) => {
  try {
    const users = await User.find({})
    response.render('users/index', {
      users: users
    })
  } catch (error) {
    console.error(error)
    response.send('Error fetching users')
  }
})

app.get('/users/:slug', async (request, response) => {
  try {
    const user = await User.findOne({ slug: request.params.slug })
    if (!user) {
      return response.status(404).send('User not found')
    }

    response.render('users/show', { user })
  } catch (error) {
    console.error(error)
    response.status(500).send('Error fetching user')
  }
})

app.get('/users/:slug/edit', async (request, response) => {
  try {
    const slug = request.params.slug
    const user = await User.findOne({ slug }).exec()
    
    if (!user) throw new Error('User not found')

    response.render('users/edit', { user })
  } catch (error) {
    console.error(error)
    response.status(404).send("Could not find the user you're looking for.")
  }
})

app.post('/users/:slug', async (request, response) => {
  const result = validateUserInput(request.body)

  if (!result.isValid) {
    return response.send(result.errors.join(' '))
  }
  
  try {
    const updatedUser = await User.findOneAndUpdate(
      { slug: request.params.slug },   
      {
        user_name: request.body.user_name,
        slug: request.body.slug,
        age: Number(request.body.age)
      },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return response.status(404).send("User not found")
    }

    response.redirect(`/users/${updatedUser.slug}`)
  } catch (error) {
    console.error(error)
    response.status(400).send("Error: The user could not be updated.")
  }
})

app.get('/users/:slug/delete', async (request, response) => {
  try {
    await User.findOneAndDelete({ slug: request.params.slug })

    response.redirect('/users')
  } catch (error) {
    console.error(error)
    response.status(400).send('Error: No user was deleted.')
  }
})

app.get('/', async (request, response) => {
  try {
    const userCount = await User.countDocuments()
    response.render('index', { userCount })
  } catch (error) {
    console.error(error)
    response.render('index', { userCount: 0 })
  }
})


// Centralized error handler
app.use((error, request, response, next) => {
  console.error(error)

  // Mongoose duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    return response.status(409).send(`Error: ${field} is already taken.`)
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(e => e.message)
    return response.status(400).send(messages.join(' '))
  }

  // Custom app errors (see below)
  if (error.statusCode) {
    return response.status(error.statusCode).send(error.message)
  }

  // Fallback
  response.status(500).send('Something went wrong.')
})

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.name = 'AppError'
  }
}
