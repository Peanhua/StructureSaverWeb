const bcrypt        = require('bcrypt')
const clientsRouter = require('express').Router()
const Client        = require('../models/client')

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
    console.log("found cookie =", cookie)
    
    if (cookie === null) {
      return response.status(400).json({
        error: 'Unknown client_id or wrong password.'
      })
    }

    response.json({
      type:   'clientLogin',
      cookie: cookie
    })

  } catch(exception) {
    next(exception)
  }
})

module.exports = clientsRouter
