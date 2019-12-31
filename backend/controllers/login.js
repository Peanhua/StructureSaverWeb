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
  relyingParty.verifyAssertion(request, async (error, result) => {
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

    const steam_id_start = 'https://steamcommunity.com/openid/id/'
    const steam_id = result.claimedIdentifier.substring(steam_id_start.length)


    const existingUser = await User.findOne({
      where: {
        steam_id: steam_id
      }
    })

    if (existingUser !== null) {
      loginUser(existingUser, response)
      return
    }

    if (!config.AUTOCREATE_STEAM_USERS) {
      response.status(400).json({
        error: 'Authentication failed (no such user).'
      })
      return
    }

    const newuser = {
      username:      steam_id,
      name:          steam_id,
      password_hash: 'not going to work',
      steam_id:      steam_id
    }

    const savedUser = await User.create(newuser)
    loginUser(savedUser, response)
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
    response.status(401).json({
      error: 'invalid username or password'
    })
    return
  }

  loginUser(user, response)
})


const loginUser = (user, response) => {
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

  response
    .status(200)
    .send(retuser)
}  

module.exports = loginRouter
