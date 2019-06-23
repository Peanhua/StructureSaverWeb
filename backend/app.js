const bodyParser  = require('body-parser')
const express     = require('express')
const loginRouter = require('./controllers/login')
const middleware  = require('./utils/middleware')

const app = express()

app.use(bodyParser.json())
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app
