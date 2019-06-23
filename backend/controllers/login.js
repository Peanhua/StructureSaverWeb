const jwt         = require('jsonwebtoken')
const bcrypt      = require('bcrypt')
const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = {
    username: "test",
    id:       1
  }
  
  const userForToken = {
    username: user.username,
    id:       user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  const retuser = {
    id:       user._id,
    username: user.username,
    name:     user.name,
    token
  }

  response
    .status(200)
    .send(retuser)
})

module.exports = loginRouter
