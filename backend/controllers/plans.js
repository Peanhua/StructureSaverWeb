const Sequelize    = require('sequelize')
const plansRouter  = require('express').Router()
const Plan         = require('../models/plan')
const Client       = require('../models/client')
const Pending      = require('../models/pending')
const auth         = require('../utils/auth')


plansRouter.get('/', async (request, response, next) => {
  try {
    const user = auth.checkFrontend(request, response, false)
    if (user === null)
      return
    
    const plans = await Plan.findAll()

    const jsonPlans = plans.map((plan) => {
      return {
        id:        plan.id,
        plan_id:   plan.plan_id,
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


plansRouter.get('/:id', async (request, response, next) => {
  try {
    const plan = await Plan.findOne({
      where: {
        id: request.params.id
      }
    })
    const jsonPlan = {
      id:        plan.id,
      plan_id:   plan.plan_id,
      player_id: plan.player_id,
      name:      plan.plan_name,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      version:   plan.data.version,
      pieces:    plan.data.pieces
    }

    return response.json(jsonPlan)
    
  } catch (exception) {
    next(exception)
  }
})


plansRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const [ cookie, client_id ] = await auth.checkClient(request, response)
    if (cookie === null)
      return

    // todo: add some checks for the validity of data, at minimum check the existence of plan_id
    console.log('Create plan, id =', request.body.data.plan_id)

    await Plan.create({
      player_id: request.body.player_id,
      plan_id:   request.body.data.plan_id,
      plan_name: request.body.plan_name,
      data:      request.body.data
    })

    Pending.remove(client_id, 'plan', request.body.data.plan_id)
    
    response.status(200).json({
      type:    'info',
      message: `Saved plan ${request.body.data.plan_id}`
    })
    
  } catch (exception) {
    console.log(exception)
    next(exception)
  }
})


module.exports = plansRouter
