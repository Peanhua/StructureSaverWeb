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

    const newuser = {
      username:      body.username,
      name:          body.name,
      password_hash: await User.passwordToHash(body.password),
      is_admin:      body.is_admin
    }

    if (body.steam_id.length > 0) {
      newuser.steam_id = body.steam_id
    }

    const savedUser = await User.create(newuser)
    
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

    if (user.is_admin === false) {
      response.json([])
      return
    }
    
    const users = await User.findAll()

    response.json(users)

  } catch(exception) {
    next(exception)
  }
})


usersRouter.post('/password/:id', async (request, response, next) => {
  // todo: allow changing users own password
  try {
    const user = auth.checkFrontend(request, response, true)
    if (user === null)
      return

    const new_password = request.body.password
    if (new_password === undefined) {
      response.status(400).json({
        error: 'Missing password.'
      })
      return
    }

    const targetuser = await User.findOne({
      where: {
        id: request.params.id
      }
    })
    if (targetuser === null) {
      response.status(404).json({ error: 'User not found error' })
      return
    }

    User.changePassword(targetuser, new_password)
    response.status(200).json({})
    
  } catch (exception) {
    next(exception)
  }
})


usersRouter.patch('/:id', async (request, response, next) => {
  // todo: allow changing some of the stuff by the user self
  try {
    const user = auth.checkFrontend(request, response, true)
    if (user === null)
      return

    const new_name     = request.body.name
    const new_steam_id = request.body.steam_id
    const new_is_admin = request.body.is_admin

    const targetuser = await User.findOne({
      where: {
        id: request.params.id
      }
    })
    if (targetuser === null) {
      response.status(404).json({ error: 'User not found error' })
      return
    }
    
    if (new_name !== undefined)
      targetuser.name = new_name
    if (new_steam_id !== undefined)
      targetuser.steam_id = new_steam_id
    if (new_is_admin !== undefined)
      targetuser.is_admin = new_is_admin

    targetuser.save()

    response.status(200).json({})
    
  } catch (exception) {
    next(exception)
  }
})
  


module.exports = usersRouter
