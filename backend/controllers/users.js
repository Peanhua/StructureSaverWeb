const usersRouter = require('express').Router()
const User        = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    if(body.username === undefined) {
      return response.status(400).json({
        error: 'missing username'
      })
    }
    
    if(body.password === undefined) {
      return response.status(400).json({
        error: 'missing password'
      })
    }

    if(body.name === undefined) {
      return response.status(400).json({
        error: 'missing name'
      })
    }
      

    if(body.password.length < 3) {
      return response.status(400).json({
        error: 'password is too short'
      })
    }

    const savedUser = await User.create({
      username:      body.username,
      name:          body.name,
      password_hash: User.passwordToHash(body.password)
    })
    
    response.json(savedUser)

  } catch (exception) {
    console.log(exception)
    next(exception)
  }

})

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.findAll()

    response.json(users)

  } catch(exception) {
    next(exception)
  }
})

module.exports = usersRouter
