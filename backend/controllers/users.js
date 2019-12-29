const usersRouter = require('express').Router()
const User        = require('../models/user')
const auth        = require('../utils/auth')

usersRouter.post('/', async (request, response, next) => {
  try {
    const user = auth.checkFrontend(request, response, true)
    if (user === null)
      return

    const body = request.body

    if(body.username === undefined) {
      response.status(400).json({
        error: 'missing username'
      })
      return
    }
    
    if(body.password === undefined) {
      response.status(400).json({
        error: 'missing password'
      })
      return
    }

    if(body.name === undefined) {
      response.status(400).json({
        error: 'missing name'
      })
      return
    }
      

    if(body.password.length < 3) {
      response.status(400).json({
        error: 'password is too short'
      })
      return
    }

    const savedUser = await User.create({
      username:      body.username,
      name:          body.name,
      password_hash: await User.passwordToHash(body.password)
    })
    
    response.json(savedUser)

  } catch (exception) {
    console.log(exception)
    next(exception)
  }
})


usersRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = auth.checkFrontend(request, response, true)
    if (user === null)
      return

    const deleteuser = await User.findOne({
      where: {
        id: request.params.id
      }
    })
    if (deleteuser === null) {
      response.status(404).json({ error: 'User not found error' })
      return
    }

    if (user.id === deleteuser.id) {
      response.status(400).json({ error: 'Not allowed to delete your own user account' })
      return
    }

    await deleteuser.destroy()
    response.status(204).end()
    
  } catch (exception) {
    next(exception)
  }
})

usersRouter.get('/', async (request, response, next) => {
  try {
    const user = auth.checkFrontend(request, response, false)
    if (user === null)
      return
    
    const users = await User.findAll()

    response.json(users)

  } catch(exception) {
    next(exception)
  }
})

module.exports = usersRouter
