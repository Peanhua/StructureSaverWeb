const Sequelize = require('sequelize')
const db        = require('../utils/db')


const Model = Sequelize.Model
const Pending = db.sequelize.define('pending', {
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

//Pending.sync()


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
  //console.log('Pending.add(client_id =', client_id, ', type =', type, ', ids =', ids, ')')
  if (Array.isArray(ids)) {
    ids.forEach((id) => {
      Pending.create({
        client_id:       client_id,
        request_type:    type,
        request_type_id: id
      })
    })
    
  } else {
    Pending.create({
      client_id:       client_id,
      request_type:    type,
      request_type_id: ids
    })
  }    
}

Pending.remove = async (client_id, type, id) => {
  //console.log('Pending.remove(client_id =', client_id, ', type =', type, ', id =', id, ')')
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
