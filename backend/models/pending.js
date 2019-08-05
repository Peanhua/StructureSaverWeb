const Sequelize = require('sequelize')

const sequelize = new Sequelize('structuresaver', null, null, {
  dialect: 'postgres',
  host: '/tmp'
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection (Pending) has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect (Pending) to the database:', err);
  });

const Model = Sequelize.Model
const Pending = sequelize.define('pending', {
  client_id: {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    false
  },
  request_type: {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    false
  },
  request_type_id: {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    false
  }
}, {
})

Pending.sync()


Pending.get = async (client_id, type) => {
  const rv = await Pending.findAll({
    attributes: ['request_type_id'],
    where: {
      client_id:    client_id,
      request_type: type
    }
  })

  return rv === null ? [] : rv.map(p => p.request_type_id)
}

Pending.add = async (client_id, type, ids) => {
  console.log('Pending.add(client_id =', client_id, ', type =', type, ', ids =', ids, ')')
  ids.forEach((id) => {
    console.log("add ", id)
    Pending.create({
      client_id:       client_id,
      request_type:    type,
      request_type_id: id
    })
  })
}

Pending.remove = async (client_id, type, id) => {
  console.log('Pending.remove(client_id =', client_id, ', type =', type, ', id =', id, ')')
  return Pending.destroy({
    where: {
      client_id:       client_id,
      request_type:    type,
      request_type_id: id
    }
  })
}

Pending.clear = async (client_id) => {
  return Pending.destroy({
    where: {
      client_id: client_id
    }
  })
}


module.exports = Pending
