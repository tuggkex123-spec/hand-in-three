import express from 'express'
import mongoose from 'mongoose'

const app = express()
const PORT = 3000

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
    slug: 'jane-doe',
    user_name: 'Jane Doe',
    age: 22
  })
  await user.save()

    response.send('User Created')
  }catch (error) {
    console.error(error)
    response.send('Error: The user could not be created.')
  }
})

app.get('/user/new', (request, response) => {
  response.render('users/new')
})