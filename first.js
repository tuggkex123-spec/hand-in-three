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
  slug: { type: String, unique: true, required: true },
  user_name: { type: String, unique: true, required: true },
  age: { type: String, required: true }, 
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
  try {
    const updatedUser = await User.findOneAndUpdate(
      { slug: request.params.slug },   
      {
        user_name: request.body.user_name,
        slug: request.body.slug,
        age: request.body.age
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