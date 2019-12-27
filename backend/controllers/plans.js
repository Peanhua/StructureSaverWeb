const Sequelize    = require('sequelize')
const plansRouter  = require('express').Router()
const Plan         = require('../models/plan')
const Client       = require('../models/client')
const Pending      = require('../models/pending')
const PlayerMemory = require('../models/playerMemory')



// todo: move /getUpdate to client controller
plansRouter.post('/getUpdate', async (request, response, next) => {
  console.log('plansRouter.getUpdate()')
  
  const cookie = request.body.cookie
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

  const known_ids = await Client.getKnownPlansByCookie(cookie)

  // Request the client to send us all the plans we don't have yet:
  const missing_ids = await Plan.getMissingPlanIds(known_ids)
  if (missing_ids.length > 0) {
    // Filter out plan ids we have already requested:
    const already_requested_ids = await Pending.get(client_id, 'plan')
    const request_ids = missing_ids.filter(id => !already_requested_ids.find((find_id) => { return find_id === id }))

    if (request_ids.length > 0) {
      console.log('Requesting plans:', request_ids)

      Pending.add(client_id, 'plan', request_ids)
      
      return response.json({
        type:     'sendPlans',
        plan_ids: request_ids
      })
    }
  }


  const known_players = await Client.getKnownPlayersByCookie(cookie)
  
  // Request the client to send us all the player memories we don't have yet:
  // todo: reuse the same code as for plans
  const missing_players = await PlayerMemory.getMissingPlayerIds(known_players)
  if (missing_players.length > 0) {
    const already_requested_ids = await Pending.get(client_id, 'playermem')
    const request_ids = missing_players.filter(id => !already_requested_ids.find((find_id) => { return find_id === id }))

    if (request_ids.length > 0) {
      console.log('Requesting players:', request_ids)

      Pending.add(client_id, 'playermem', request_ids)

      return response.json({
        type:       'sendPlayerMemories',
        player_ids: request_ids
      })
    }
  }

  // Send plans we have but client doesn't have yet:
  const plan = await Plan.getNextPlanToSend(known_ids)
  if (plan !== null) {
    console.log('Sending plan', plan.plan_id)
    // todo: wait for confirmation from the client before calling addKnownPlan...() ? will then need to keep track of what we have sent and only send again after a long timeout
    await Client.addKnownPlanByCookie(cookie, plan.plan_id)
    return response.json({
      type:      'plan',
      player_id: plan.player_id,
      plan:      plan.data
    })
  }

  // Send player memories we have but client doesn't have yet:
  const mem = await PlayerMemory.getNextPlayerMemoryToSend(known_players)
  if (mem !== null) {
    console.log('Sending player memory', mem.player_id)
    await Client.addKnownPlayerByCookie(cookie, mem.player_id)
    return response.json({
      type:         'playerMemory',
      playerMemory: mem.memory
    })
  }
      
  
  return response.status(200).json({
    type: 'success'
  })
})


plansRouter.get('/', async (request, response, next) => {
  try {
    const plans = await Plan.findAll()

    const jsonPlans = plans.map((plan) => {
      return {
        id:        plan.plan_id,
        player_id: plan.player_id,
        name:      plan.plan_name,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt
      }
    })
    response.json(jsonPlans)

  } catch (exception) {
    next(exception)
  }
})


plansRouter.post('/', async (request, response, next) => {
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
    // todo: add some checks for the validity of data, at minimum check the existence of plan_id
    console.log('Create plan, id =', request.body.data.plan_id)

    await Plan.create({
      player_id: request.body.player_id,
      plan_id:   request.body.data.plan_id,
      data:      request.body.data
    })

    Pending.remove(client_id, 'plan', request.body.data.plan_id)
    
    return response.status(200).json({
      type:    'info',
      message: `Saved plan ${request.body.data.plan_id}`
    })
    
  } catch (exception) {
    console.log(exception)
    return next(exception)
  }
})



module.exports = plansRouter
