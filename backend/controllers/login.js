const jwt         = require('jsonwebtoken')
const bcrypt      = require('bcrypt')
const loginRouter = require('express').Router()

const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })
  
  const passwordCorrect = 
    user === null ? false
                  : await bcrypt.compare(body.password, user.password_hash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id:       user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  const retuser = {
    id:       user._id,
    username: user.username,
    name:     user.name,
    token
  }

  return response
    .status(200)
    .send(retuser)
})

module.exports = loginRouter
