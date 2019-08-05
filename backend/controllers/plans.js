const plansRouter = require('express').Router()
const Plan        = require('../models/plan')
const Client      = require('../models/client')
const Pending     = require('../models/pending')



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
    console.log(already_requested_ids)
    const request_ids = missing_ids.filter(id => !already_requested_ids.find((find_id) => { return find_id === id }))
    
    console.log('Requesting plans:', request_ids)

    Pending.add(client_id, 'plan', request_ids)
    
    return response.json({
      type:     'sendPlans',
      plan_ids: request_ids
    })
  }

  // Send plans we have but client doesn't have yet:
  const plan = await Plan.getNextPlanToSend(known_ids)
  if (plan !== null) {
    console.log('Sending plan', plan)
    // todo: wait for confirmation from the client before calling addKnownPlan...() ? will then need to keep track of what we have sent and only send again after a long timeout
    await Client.addKnownPlanByCookie(cookie, plan.plan_id)
    return response.json({
      type: 'plan',
      plan: plan.data
    })
  }
  
  return response.status(200)
})


plansRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    // todo: decide whether we fully trust the client or not, knowing who the client is, is not mandatory in here... user/account controller currently trusts the incoming requests
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
      plan_id: request.body.data.plan_id,
      data:    request.body.data
    })

    Pending.remove(client_id, 'plan', request.body.data.plan_id)
    
    return response.status(200)
    
  } catch (exception) {
    console.log(exception)
    return next(exception)
  }
})


plansRouter.post('/synchronize', async (request, response, next) => {
  try {
    console.log('plansRouter.synchronize()')
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

    Client.addKnownPlanByCookie(cookie, plan_ids)

    return response.json({
      type: 'synchronize',
    })
    
  } catch (exception) {
    console.log(exception)
    return next(exception)
  }
})


module.exports = plansRouter
