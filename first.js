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
