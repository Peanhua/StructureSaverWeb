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

  let ct = request.query.last_time
  if (ct === undefined || ct === "" )
    ct = 0
  ct++
  
  const rv = {
    stuff: 0,
    current: ct
  }

  response.json(rv)
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
    if (Client.checkCookie(cookie) === null) {
      return response.status(400).json({
        error: 'Not logged in.'
      })
    }

    console.log('Create plan, id =', request.body.data.plan_id)
    const savedPlan = await Plan.create({
      plan_id: request.body.data.plan_id,
      data:    request.body.data
    })
    response.status(200)
    
  } catch (exception) {
    console.log(exception)
    next(exception)
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

    // Request the client to send us all the plans we don't have yet:
    const request_ids = Plan.getMissingPlanIds(plan_ids)

    console.log(`Requesting: ${request_ids}`)

    response.json({
      type:          'plansSynchronize',
      send_plan_ids: request_ids
    })
    
  } catch (exception) {
    console.log(exception)
    next(exception)
  }
})


module.exports = plansRouter
