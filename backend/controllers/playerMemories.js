const playerMemoriesRouter = require('express').Router()
const PlayerMemory         = require('../models/playerMemory')
const Plan                 = require('../models/plan')
const Client               = require('../models/client')
const Pending              = require('../models/pending')
const auth                 = require('../utils/auth')

playerMemoriesRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const cookie = await auth.checkClient(request, response)
    if (cookie === null)
      return

    const mem = body.data
    
    console.log('Create playerMemory, player_id =', mem.player_id)

    const saved = await PlayerMemory.create({
      player_id: mem.player_id,
      memory:    mem
    })

    // Update the names of the plans:
    for (let i = 0; i < mem.building_plan_ids.length; i++) {
      Plan.update({
        plan_name: mem.building_plan_names[i]
      }, {
        where: {
          plan_id: mem.building_plan_ids[i]
        }
      })
    }

    Pending.remove(client_id, 'playermem', mem.player_id)

    response.status(200).json({
      type: 'success'
    })
    
  } catch (exception) {
    next(exception)
  }
})


playerMemoriesRouter.post('/synchronize', async (request, response, next) => {
  try {
    console.log('playerMemoriesRouter.synchronize()')
    const body = request.body

    const cookie = await auth.checkClient(request, response)
    if (cookie === null)
      return

    const plan_ids = body.plan_ids
    if (plan_ids === undefined) {
      response.status(400).json({
        error: 'Missing plan_ids.'
      })
      return
    }

    if (! Array.isArray(plan_ids)) {
      response.status(400).json({
        error: 'Incorrect type for plan_ids.'
      })
      return
    }

    if (plan_ids.length > 0) {
      await Client.addKnownPlanByCookie(cookie, plan_ids)
    }


    const player_id = body.player_id
    if (player_id === undefined) {
      response.status(400).json({
        error: 'Missing player_id.'
      })
      return
    }

    await Client.addKnownPlayerByCookie(cookie, player_id)


    response.status(200).json({
      type: 'synchronize'
    })

  } catch (exception) {
    console.log(exception)
    next(exception)
  }
})


module.exports = playerMemoriesRouter
