const clientsRouter = require('express').Router()
const Client        = require('../models/client')
const Plan          = require('../models/plan')
const Pending       = require('../models/pending')
const auth          = require('../utils/auth')

clientsRouter.post('/', async (request, response, next) => {
  try {
    const user = auth.checkFrontend(request, response, true)
    if (user === null)
      return
    
    const body = request.body

    const client_id = body.client_id
    if (client_id === undefined) {
      response.status(400).json({
        error: 'Missing client_id.'
      })
      return
    }

    const password = body.password
    if (password === undefined) {
      response.status(400).json({
        error: 'Missing password.'
      })
      return
    }

    const saved = await Client.createNewClient(client_id, password)
    response.json(saved)
    
  } catch (exception) {
    next(exception)
  }
})


clientsRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = auth.checkFrontend(request, response, true)
    if (user === null)
      return

    const deleteclient = await Client.findOne({
      where: {
        id: request.params.id
      }
    })
    if (deleteclient === null) {
      response.status(404).json({ error: 'Client not found error' })
      return
    }

    await deleteclient.destroy()
    response.status(204).end()
    
  } catch (exception) {
    next(exception)
  }
})


clientsRouter.get('/', async (request, response, next) => {
  try {
    const user = auth.checkFrontend(request, response, false)
    if (user === null)
      return

    if (user.is_admin === false) {
      response.json([])
      return
    }

    const clients = await Client.findAll()

    const jsonClients = clients.map((client) => {
      return {
        id:        client.id,
        client_id: client.client_id,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt
      }
    })

    response.json(jsonClients)
    
  } catch (exception) {
    next(exception)
  }
})


clientsRouter.post('/login', async (request, response, next) => {
  try {
    const body = request.body

    const client_id = body.client_id
    if (client_id === undefined) {
      response.status(400).json({
        error: 'Missing client_id.'
      })
      return
    }

    const password = body.password
    if (password === undefined) {
      response.status(400).json({
        error: 'Missing password.'
      })
      return
    }

    const version = body.version
    if (version === undefined) {
      response.status(400).json({
        error: 'Missing version.'
      })
      return
    }

    const required_version = 1
    if (parseInt(version) !== required_version) {
      response.status(400).json({
        error: 'Incorrect version "' + version + '", backend requires version ' + required_version
      })
      return
    }
    
    const cookie = await Client.authenticate(client_id, password)
    if (cookie === null) {
      response.status(400).json({
        error: 'Unknown client_id or wrong password.'
      })
      return
    }

    Pending.clear(client_id)
    Client.setKnownPlansByCookie(cookie, [])

    response.status(200).json({
      type:   'clientLogin',
      cookie: cookie
    })

  } catch(exception) {
    next(exception)
  }
})


clientsRouter.post('/synchronize', async (request, response, next) => {
  try {
    console.log('plansRouter.synchronize()')
    const body = request.body

    const [ cookie, client_id ] = await auth.checkClient(request, response)
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

    response.status(200).json({
      type: 'synchronize'
    })

  } catch (exception) {
    console.log(exception)
    next(exception)
  }
})


clientsRouter.post('/password/:id', async (request, response, next) => {
  try {
    const user = auth.checkFrontend(request, response, true)
    if (user === null)
      return

    const new_password = request.body.password
    if (new_password === undefined) {
      response.status(400).json({
        error: 'Missing password.'
      })
      return
    }

    const client = await Client.findOne({
      where: {
        id: request.params.id
      }
    })
    if (client === null) {
      response.status(404).json({ error: 'Client not found error' })
      return
    }

    Client.changePassword(client, new_password)
    response.status(200).json({})
    
  } catch (exception) {
    next(exception)
  }
})



clientsRouter.post('/getUpdate', async (request, response, next) => {
  console.log('clientsRouter.getUpdate()')

  const [ cookie, client_id ] = await auth.checkClient(request, response)
  if (cookie === null)
    return
  
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
      
      response.json({
        type:     'sendPlans',
        plan_ids: request_ids
      })
      return
    }
  }


  // Send plans we have but client doesn't have yet:
  const plan = await Plan.getNextPlanToSend(known_ids)
  if (plan !== null) {
    console.log('Sending plan', plan.plan_id)
    // todo: wait for confirmation from the client before calling addKnownPlan...() ? will then need to keep track of what we have sent and only send again after a long timeout
    await Client.addKnownPlanByCookie(cookie, plan.plan_id)
    response.json({
      type:      'plan',
      player_id: plan.player_id,
      plan_name: plan.plan_name,
      plan:      plan.data
    })
    return
  }


  if (await returnPlanNameUpdate(client_id, response))
    return

  if (await returnPlanDelete(client_id, response))
    return

  
  response.status(200).json({
    type: 'success'
  })
})

// Return plan name update:
const returnPlanNameUpdate = async (client_id, response) => {
  const plan_ids = await Pending.get(client_id, 'plan_name') // todo: add a getOne() method
  if (plan_ids.length === 0)
    return false
  
  const plan_id = plan_ids[0]
  
  Pending.remove(client_id, 'plan_name', plan_id)
  
  const plan = await Plan.findOne({
    where: {
      plan_id: plan_id
    }
  })
  
  if (plan === null)
    return false
  
  response.json({
    type:      'planField',
    player_id: plan.player_id,
    plan_id:   plan.plan_id,
    field:     'name',
    value:     plan.plan_name
  })
  return true
}

const returnPlanDelete = async (client_id, response) => {
  const plan_ids = await Pending.get(client_id, 'planDelete')
  if (plan_ids.length === 0)
    return false

  const plan_id = plan_ids[0]

  Pending.remove(client_id, 'planDelete', plan_id)

  response.json({
    type:   'planDelete',
    plan_id: plan_id
  })

  return true
}



module.exports = clientsRouter
