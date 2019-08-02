const bodyParser  = require('body-parser')
const express     = require('express')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const plansRouter = require('./controllers/plans')
const middleware  = require('./utils/middleware')

const app = express()

app.use(bodyParser.json({
  limit: '1GB'
}))
app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/plans', plansRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app
