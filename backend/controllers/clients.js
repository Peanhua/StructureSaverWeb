const clientsRouter = require('express').Router()
const Client        = require('../models/client')
const Pending       = require('../models/pending')
const auth          = require('../utils/auth')

clientsRouter.post('/', async (request, response, next) => {
  try {
    const user = auth.checkFrontend(request, response, true)
    if (user === null)
      return
    
    const body = request.body

    const client_id = body.client_id
    if (client_id === undefined) {
      response.status(400).json({
        error: 'Missing client_id.'
      })
      return
    }

    const password = body.password
    if (password === undefined) {
      response.status(400).json({
        error: 'Missing password.'
      })
      return
    }

    const saved = await Client.createNewClient(client_id, password)
    response.json(saved)
    
  } catch (exception) {
    next(exception)
  }
})


clientsRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = auth.checkFrontend(request, response, true)
    if (user === null)
      return

    const deleteclient = await Client.findOne({
      where: {
        id: request.params.id
      }
    })
    if (deleteclient === null) {
      response.status(404).json({ error: 'Client not found error' })
      return
    }

    await deleteclient.destroy()
    response.status(204).end()
    
  } catch (exception) {
    next(exception)
  }
})


clientsRouter.get('/', async (request, response, next) => {
  try {
    const user = auth.checkFrontend(request, response, false)
    if (user === null)
      return

    const clients = await Client.findAll()

    const jsonClients = clients.map((client) => {
      return {
        id:        client.id,
        client_id: client.client_id,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt
      }
    })

    response.json(jsonClients)
    
  } catch (exception) {
    next(exception)
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

    Pending.clear(client_id)
    Client.setKnownPlansByCookie(cookie, [])
    Client.setKnownPlayersByCookie(cookie, [])

    return response.status(200).json({
      type:   'clientLogin',
      cookie: cookie
    })

  } catch(exception) {
    return next(exception)
  }
})

module.exports = clientsRouter
