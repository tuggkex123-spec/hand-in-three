import express from 'express'
import mongoose from 'mongoose'

const app = express()
const PORT = 3000

mongoose.connect('mongodb://127.0.0.1:27017/admin')

app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`)
})
