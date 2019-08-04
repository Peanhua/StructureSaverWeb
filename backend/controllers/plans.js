const plansRouter = require('express').Router()
const Plan        = require('../models/plan')
const Client      = require('../models/client')



plansRouter.get('/getUpdate', async (request, response, next) => {
  const cookie = request.query.cookie
  if (cookie === undefined) {
    return response.status(400).json({
      error: 'Missing cookie.'
    })
  }
  if (Client.checkCookie(cookie) === null) {
    return response.status(400).json({
      error: 'Not logged in.'
    })
  }

  const known_ids = await Client.getKnownPlansByCookie(cookie)
  const plan = await Plan.getNextPlanToSend(known_ids)
  console.log(`PlanToSend = ${plan}`)
  if (plan !== null) {
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
    if (Client.checkCookie(cookie) === null) {
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

    return response.status(200)
    
  } catch (exception) {
    console.log(exception)
    return next(exception)
  }
})


plansRouter.post('/synchronize', async (request, response, next) => {
  try {
    const body = request.body

    const cookie = body.cookie
    if (cookie === undefined) {
      return response.status(400).json({
        error: 'Missing cookie.'
      })
    }
    if (Client.checkCookie(cookie) === null) {
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

    console.log("plan_ids =", typeof plan_ids)
    Client.setKnownPlansByCookie(cookie, plan_ids)

    // Request the client to send us all the plans we don't have yet:
    const request_ids = await Plan.getMissingPlanIds(plan_ids)

    console.log(`Requesting: ${request_ids}`)

    return response.json({
      type:          'plansSynchronize',
      send_plan_ids: request_ids
    })
    
  } catch (exception) {
    console.log(exception)
    return next(exception)
  }
})


module.exports = plansRouter
