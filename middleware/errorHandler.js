export default function errorHandler(error, req, res, next) {
  console.error(error)

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    return res.status(409).send(`Error: ${field} is already taken.`)
  }

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(e => e.message)
    return res.status(400).send(messages.join(' '))
  }

  if (error.statusCode) {
    return res.status(error.statusCode).send(error.message)
  }

  res.status(500).send('Something went wrong.')
}
