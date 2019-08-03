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
    allowNull: true,
    unique:    true
  }
}, {
})

Client.sync()



Client.authenticate = async (client_id, password) => {
  const salt_rounds = 10
  const password_hash = await bcrypt.hash(password, salt_rounds)
    
  const res = await Client.findAll({
    attributes: ['client_id'],
    where: {
      client_id:     client_id,
      password_hash: password_hash
    }
  })

  if (res.length === 0) {
    return null
  }

  const secret = 'verisiikret' // todo: read from ini, add some random stuff into it
  const cookie = await bcrypt.hash(secret + password_hash, salt_rounds)
  // todo: handle the case where we create identical cookie with someone else by re-creating a new cookie for this client
  
  await Client.setCookie(client_id, cookie)
  // todo: handle failures
  
  return cookie
}

Client.setCookie = (client_id, cookie) => {
  return Client.update({
    cookie: cookie
  }, {
    where: {
      client_id: client_id
    }
  })
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


module.exports = Client
