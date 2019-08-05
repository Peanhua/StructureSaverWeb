const playerMemoriesRouter = require('express').Router()
const PlayerMemory         = require('../models/playerMemory')
const Client               = require('../models/client')
const Pending              = require('../models/pending')


playerMemoriesRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const cookie = body.cookie
    if (cookie === undefined) {
      return response.status(400).json({
        error: 'Missing cookie.'
      })
    }

    const client_id = await Client.checkCookie(cookie)
    if (client_id === null) {
      return response.status(400).json({
        error: 'Not logged in.'
      })
    }

    const mem = body.data
    
    console.log('Create playerMemory, player_id =', mem.player_id)

    const saved = await PlayerMemory.create({
      player_id: mem.player_id,
      memory:    mem
    })

    Pending.remove(client_id, 'playermem', mem.player_id)

    return response.json(saved)
    
  } catch (exception) {
    return next(exception)
  }
})


module.exports = playerMemoriesRouter
