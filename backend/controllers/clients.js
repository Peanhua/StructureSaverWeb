const bcrypt        = require('bcrypt')
const clientsRouter = require('express').Router()
const Client        = require('../models/client')


clientsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const client_id = body.client_id
    if (client_id === undefined) {
      return response.status(400).json({
        error: 'Missing client_id.'
      })
    }

    const password = body.password
    if (password === undefined) {
      return response.status(400).json({
        error: 'Missing password.'
      })
    }
    const password_hash = await Client.passwordToHash(password)
    console.log("password_hash =", password_hash)

    const cookie = await Client.createCookie(client_id, password_hash)
    console.log("cookie =", cookie)

    const saved = await Client.create({
      client_id:     client_id,
      password_hash: password_hash,
      cookie:        cookie
    })

    return response.json(saved)
    
  } catch (exception) {
    return next(exception)
  }
})


clientsRouter.post('/login', async (request, response, next) => {
  try {
    const body = request.body

    const client_id = body.client_id
    if (client_id === undefined) {
      return response.status(400).json({
        error: 'Missing client_id.'
      })
    }

    const password = body.password
    if (password === undefined) {
      return response.status(400).json({
        error: 'Missing password.'
      })
    }

    const cookie = await Client.authenticate(client_id, password)
    if (cookie === null) {
      return response.status(400).json({
        error: 'Unknown client_id or wrong password.'
      })
    }

    Client.setKnownPlansByCookie(cookie, [])

    return response.json({
      type:   'clientLogin',
      cookie: cookie
    })

  } catch(exception) {
    return next(exception)
  }
})

module.exports = clientsRouter
