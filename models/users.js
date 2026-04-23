import mongoose from 'mongoose'

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

export default mongoose.model('User', userSchema)
