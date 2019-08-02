const plansRouter = require('express').Router()
const Plan        = require('../models/plan')
const Sequelize = require('sequelize')

plansRouter.get('/getUpdate', async (request, response, next) => {
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


plansRouter.post('/create', async (request, response, next) => {
  try {
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

    if (body.plan_ids === undefined) {
      return response.status(400).json({
        error: 'missing plan_ids'
      })
    }

    const plan_ids = body.plan_ids
    if (! Array.isArray(plan_ids)) {
      return response.status(400).json({
        error: 'incorrect type for plan_ids'
      })
    }

    // Request all the plans we don't have yet:
    const existing_ids = await Plan.findAll({
      attributes: ['plan_id'],
      where: {
        plan_id: {
          [Sequelize.Op.in]: plan_ids 
        }
      }
    }).map(plan => plan.plan_id)

    console.log("plan_ids =", plan_ids)
    console.log("existing_ids =", existing_ids)
    const request_ids = plan_ids.filter(id => !existing_ids.find((find_id) => { return find_id === id }))

    /*
    plan_ids.forEach(async (id) => {
      const res = await Plan.findAll({
        attributes: ['plan_id'],
        where: {
          plan_id: id
        }
      })
      if (res.length === 0) {
        request_ids.push(id)
      }
    })
    */
    console.log(`Requesting: ${request_ids}`)

    response.json({
      type:     'sendPlans',
      plan_ids: request_ids
    })
    
  } catch (exception) {
    console.log(exception)
    next(exception)
  }
})


module.exports = plansRouter
