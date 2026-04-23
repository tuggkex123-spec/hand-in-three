import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 3000

connectDB()
  .then(() => {
    console.log('💽 Database connected')

    app.listen(PORT, () => {
      console.log(`👋 Started server on port ${PORT}`)
    })
  })
  .catch(error => {
    console.error('Database connection failed:', error)
  })
