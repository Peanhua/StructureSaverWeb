const jwt    = require('jsonwebtoken')
const Client = require('../models/client')
const config = require('./config')

const checkClient = async (request, response) => {
  const cookie = request.body.cookie
  if (cookie === undefined) {
    response.status(400).json({
      error: 'Missing cookie.'
    })
    return [ null, null ]
  }

  const client_id = await Client.checkCookie(cookie)
  if (client_id === null) {
    response.status(400).json({
      error: 'Not logged in.'
    })
    return [ null, null ]
  }

  return [
    cookie,
    client_id
  ]
}

const checkFrontend = (request, response, must_be_admin) => {
  if(!request.token) {
    response.status(401).json({ error: 'Missing token' })
    return null
  }

  const decodedToken = jwt.verify(request.token, config.JWTSECRET)

  if(!decodedToken.id) {
    response.status(401).json({ error: 'Missing token' })
    return null
  }

  if (must_be_admin && decodedToken.is_admin !== true) {
    response.status(401).json({ error: 'Unauthorized' })
    return null
  }
  
  return decodedToken
}


module.exports = {
  checkClient,
  checkFrontend
}
