const bodyParser  = require('body-parser')
const express     = require('express')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const gameServerRouter = require('./controllers/gameServer')
const middleware  = require('./utils/middleware')

const app = express()

app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/server', gameServerRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app
