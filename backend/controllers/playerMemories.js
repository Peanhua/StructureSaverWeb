const playerMemoriesRouter = require('express').Router()
const PlayerMemory         = require('../models/playerMemory')
const Client               = require('../models/client')
const Pending              = require('../models/pending')
const PlayerMemoryPlanId   = require('../models/playerMemoryPlanId')


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

    // todo: this should be done in a create function of PlayerMemory
    mem.building_plan_ids.forEach((plan_id) => {
      saved.addPlayerMemoryPlanId({
        player_id: mem.player_id,
        plan_id:   plan_id
      })
    })

    Pending.remove(client_id, 'playermem', mem.player_id)

    return response.status(200).json({
      type: 'success'
    })
    
  } catch (exception) {
    return next(exception)
  }
})


playerMemoriesRouter.post('/synchronize', async (request, response, next) => {
  try {
    console.log('playerMemoriesRouter.synchronize()')
    const body = request.body

    const cookie = body.cookie
    if (cookie === undefined) {
      return response.status(400).json({
        error: 'Missing cookie.'
      })
    }
    if (await Client.checkCookie(cookie) === null) {
      return response.status(400).json({
        error: 'Not logged in.'
      })
    }

    const plan_ids = body.plan_ids
    if (plan_ids === undefined) {
      return response.status(400).json({
        error: 'Missing plan_ids.'
      })
    }

    if (! Array.isArray(plan_ids)) {
      return response.status(400).json({
        error: 'Incorrect type for plan_ids.'
      })
    }

    if (plan_ids.length > 0) {
      Client.addKnownPlanByCookie(cookie, plan_ids)
    }


    const player_id = body.player_id
    if (player_id === undefined) {
      return response.status(400).json({
        error: 'Missing player_id.'
      })
    }

    Client.addKnownPlayerByCookie(cookie, player_id)


    return response.status(200).json({
      type: 'synchronize'
    })

  } catch (exception) {
    console.log(exception)
    return next(exception)
  }
})


module.exports = playerMemoriesRouter
