const jwt         = require('jsonwebtoken')
const bcrypt      = require('bcrypt')
const openid      = require('openid')
const loginRouter = require('express').Router()
const config      = require('../utils/config')

const User = require('../models/user')


const relyingParty = new openid.RelyingParty(
  'http://localhost:3000/steamLogin', // Verification URL (yours)
  null,  // Realm (optional, specifies realm for OpenID authentication)
  true,  // Use stateless verification
  false, // Strict mode
  []     // List of extensions to enable and include
)

loginRouter.get('/steamAuthUrl', async (request, response) => {
  const identifier = 'https://steamcommunity.com/openid'

  relyingParty.authenticate(identifier, false, (error, authUrl) => {
    if (error) {
      response.status(400).json({
        error: error.message
      })
      return
    }

    if (!authUrl) {
      response.status(400).json({
        error: 'Authentication failed (authUrl).'
      })
      return
    }

    response.status(200).json({
      authUrl: authUrl
    })
  })
})

loginRouter.get('/steamAuthenticate', async (request, response) => {
  relyingParty.verifyAssertion(request, (error, result) => {
    if (error) {
      response.status(400).json({
        error: error.message
      })
      return
    }

    if (!result.authenticated) {
      response.status(400).json({
        error: 'Authentication failed (not authenticated).'
      })
      return
    }

    const steamIdStart = 'https://steamcommunity.com/openid/id/'
    const steamId = result.claimedIdentifier.substring(steamIdStart.length)

    console.log("Steam ID =", steamId)
    const userForToken = {
      username: 'kek',
      id:       42,
      is_admin: false
    }

    const token = jwt.sign(userForToken, config.JWTSECRET)
    
    const retuser = {
      id:       42,
      username: 'kek',
      name:     'kekkonen',
      is_admin: false,
      token
    }

    response
      .status(200)
      .send(retuser)
  })
})

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })
  
  const passwordCorrect = 
    user === null ? false
                  : await bcrypt.compare(body.password, user.password_hash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id:       user.id,
    is_admin: user.is_admin
  }

  const token = jwt.sign(userForToken, config.JWTSECRET)

  const retuser = {
    id:       user.id,
    username: user.username,
    name:     user.name,
    is_admin: user.is_admin,
    token
  }

  return response
    .status(200)
    .send(retuser)
})

module.exports = loginRouter
