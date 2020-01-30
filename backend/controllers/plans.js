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

    let plans = []

    if (user.is_admin) {
      plans = await Plan.findAll()

    } else {
      plans = await Plan.findAll({
        where: {
          player_id: user.steam_id
        }
      })
    }

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
    const user = auth.checkFrontend(request, response, false)
    if (user === null)
      return

    let plan = {}

    if (user.is_admin) {
      plan = await Plan.findOne({
        where: {
          id: request.params.id
        }
      })

    } else {
      plan = await Plan.findOne({
        where: {
          id:        request.params.id,
          player_id: user.steam_id
        }
      })
    }
    
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

    response.json(jsonPlan)
    
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


plansRouter.post('/updateField', async (request, response, next) => {
  try {
    const body = request.body

    const [ cookie, client_id ] = await auth.checkClient(request, response)
    if (cookie === null)
      return

    const plan_id = body.plan_id
    if (plan_id === undefined) {
      response.status(400).json({
        error: 'Missing plan_id.'
      })
      return
    }
    
    const field = body.field
    if (field === undefined) {
      response.status(400).json({
        error: 'Missing field.'
      })
      return
    }

    const value = body.value
    if (value === undefined) {
      response.status(400).json({
        error: 'Missing value.'
      })
      return
    }

    console.log(`Update plan field "${field}" to "${value}" where plan_id="${plan_id}".`)
    const plan = await Plan.findOne({
      where: {
        plan_id: plan_id
      }
    })
    if (plan === null) {
      response.status(400).json({
        error: 'Unknown plan.'
      })
      return
    }

    if (field === 'name') {
      if (typeof(value) !== 'string') {
        response.status(400).json({
          error: 'Incorrect value type, expected string, got ' + typeof(value)
        })
        return
      }
      plan.plan_name = value
      plan.save()
      
    } else if (field === 'usertext') {
      if (typeof(value) !== 'string') {
        response.status(400).json({
          error: 'Incorrect value type, expected string, got ' + typeof(value)
        })
        return
      }
      plan.data.usertext = value
      plan.save()

    } else if (field === 'modlist') {
      if (!Array.isArray(value)) {
        response.status(400).json({
          error: 'Incorrect value type, expected array, got ' + typeof(value)
        })
        return
      }
      //plan.data.mods = value // For some reason doing it this way does not get the plan saved, maybe dirty bit is not set on plan with this?
      const newdata = plan.data
      newdata.mods = value
      plan.data = newdata
      plan.save()
      
    } else {
      response.status(400).json({
        error: 'Unknown field: ' + field
      })
      return
    }

    
    const clients = await Client.findAll({
      attributes: ['client_id'],
      where: {
        client_id: {
          [Sequelize.Op.ne]: client_id
        }
      }
    })
    
    clients.forEach((client) => {
      Pending.add(client.client_id, 'plan_' + field, plan_id)
    })

    response.status(200)
    
  } catch (exception) {
    console.log(exception)
    next(exception)
  }
})


module.exports = plansRouter
