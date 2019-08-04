const Sequelize = require('sequelize')
const bcrypt    = require('bcrypt')

const sequelize = new Sequelize('structuresaver', null, null, {
  dialect: 'postgres',
  host: '/tmp'
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Model = Sequelize.Model
const Client = sequelize.define('client', {
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
  console.log(`Client.authenticate(${client_id}, ${password})`)
    
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
  const res = await Client.findAll({
    attributes: ['client_id'],
    where: {
      cookie: cookie
    }
  })

  if (res.length === 0) {
    return null
  }

  return res.client_id
}


Client.getKnownPlansByCookie = async (cookie) => {
  console.log(`getKnownPlansByCookie(${cookie})`)

  const res = await Client.findAll({
    attributes: ['known_plan_ids'],
    where: {
      cookie: cookie
    }
  })
  console.log(res)
  return res.known_plan_ids
}

Client.setKnownPlansByCookie = async (cookie, known_plan_ids) => {
  console.log(`setKnownPlansByCookie(${cookie}, ${known_plan_ids})`)

  return Client.update({
    known_plan_ids: known_plan_ids
  }, {
    where: {
      cookie: cookie
    }
  })
}


Client.addKnownPlanByCookie = async (cookie, plan_id) => {
  console.log(`addKnownPlanByCookie(${cookie}, ${plan_id})`)

  let known_plans = await Client.getKnownPlansByCookie(cookie)
  if (!Array.isArray(known_plans)) {
    known_plans = []
  }

  known_plans.push(plan_id)

  Client.setKnownPlansByCookie(cookie, known_plans)
}


module.exports = Client
