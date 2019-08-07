const Sequelize = require('sequelize')
const bcrypt    = require('bcrypt')
const db        = require('../utils/db')


const Model = Sequelize.Model
const Client = db.sequelize.define('client', {
  client_id: {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    true
  },
  password_hash: {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    false
  },
  cookie: {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    true
  },
  known_plan_ids: {
    type:      Sequelize.JSON,
    allowNull: true
  },
  known_player_ids: {
    type:      Sequelize.JSON,
    allowNull: true
  }
}, {
})

Client.sync()



Client.passwordToHash = async (password) => {
  const salt_rounds = 10
  return await bcrypt.hash(password, salt_rounds)
}


Client.createCookie = async (client_id, password_hash) => {
  // todo: don't use password_hash for making this unique
  const secret = 'verisiikret' // todo: read from ini, add some random stuff into it
  const salt_rounds = 3
  const cookie = await bcrypt.hash(secret + password_hash, salt_rounds)
  // todo: handle the case where we create identical cookie with someone else by re-creating a new cookie for this client

  await Client.update({
    cookie: cookie
  }, {
    where: {
      client_id: client_id
    }
  })
  // todo: handle failures

  return cookie
}


Client.authenticate = async (client_id, password) => {
  console.log('Client.authenticate(client_id =' , client_id, ' password =', password, ')')
    
  const client = await Client.findOne({
    where: {
      client_id: client_id
    }
  })

  if (client === null) {
    return null
  }

  if (! await bcrypt.compare(password, client.password_hash)) {
    return null
  }
  
  const cookie = await Client.createCookie(client_id, client.password_hash)
  
  return cookie
}


Client.checkCookie = async (cookie) => {
  console.log('Client.checkCookie(cookie =', cookie, ')')
  
  const res = await Client.findOne({
    where: {
      cookie: cookie
    }
  })

  if (res === null) {
    return null
  }

  return res.client_id
}



// Known plans:
Client.getKnownPlansByCookie = async (cookie) => {
  console.log(`Client.getKnownPlansByCookie(${cookie})`)

  const res = await Client.findOne({
    where: {
      cookie: cookie
    }
  })

  return res.known_plan_ids
}

Client.setKnownPlansByCookie = async (cookie, known_plan_ids) => {
  console.log('Client.setKnownPlansByCookie(cookie =', cookie, ', known_plan_ids =', known_plan_ids, ')')

  return Client.update({
    known_plan_ids: known_plan_ids
  }, {
    where: {
      cookie: cookie
    }
  })
}

Client.addKnownPlanByCookie = async (cookie, plan_id) => {
  console.log('Client.addKnownPlanByCookie(cookie =', cookie, ', plan_id(s) =', plan_id, ')')

  let known_plans = await Client.getKnownPlansByCookie(cookie)
  if (!Array.isArray(known_plans)) {
    known_plans = []
  }

  if (Array.isArray(plan_id)) {
    known_plans = known_plans.concat(plan_id)
  } else {
    known_plans.push(plan_id)
  }

  Client.setKnownPlansByCookie(cookie, known_plans)
}



// Known players:
// todo: could share the same code with known plans -stuff
// todo: instead of using cookie, use the client_id because we have it anyway
Client.getKnownPlayersByCookie = async (cookie) => {
  console.log(`Client.getKnownPlayersByCookie(${cookie})`)

  const res = await Client.findOne({
    where: {
      cookie: cookie
    }
  })

  return res.known_player_ids
}

Client.setKnownPlayersByCookie = async (cookie, known_player_ids) => {
  console.log('Client.setKnownPlayersByCookie(cookie =', cookie, ', known_player_ids =', known_player_ids, ')')

  return Client.update({
    known_player_ids: known_player_ids
  }, {
    where: {
      cookie: cookie
    }
  })
}

Client.addKnownPlayerByCookie = async (cookie, player_id) => {
  console.log('Client.addKnownPlayerByCookie(cookie =', cookie, ', player_id(s) =', player_id, ')')

  let known_players = await Client.getKnownPlayersByCookie(cookie)
  if (!Array.isArray(known_players)) {
    known_players = []
  }

  if (Array.isArray(player_id)) {
    known_players = known_players.concat(player_id)
  } else {
    known_players.push(player_id)
  }

  Client.setKnownPlayersByCookie(cookie, known_players)
}



module.exports = Client
