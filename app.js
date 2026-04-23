import express from 'express'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use('/users', userRoutes)


export default app
