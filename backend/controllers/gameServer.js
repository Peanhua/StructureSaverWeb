const gameServerRouter = require('express').Router()

gameServerRouter.get('/getUpdate', async (request, response, next) => {
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


gameServerRouter.post('/synchronize', async (request, response, next) => {
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

    // pretend we don't have any of the plans, and request the game server to send them all:
    const request_ids = []
    plan_ids.forEach((id) => {
      request_ids.push(id)
    })
    console.log(`Requesting: {request_ids}`)

    response.json({
      send_to_backend: request_ids
    })
    
  } catch (exception) {
    console.log(exception)
    next(exception)
  }
})


module.exports = gameServerRouter
