const Sequelize = require('sequelize')
const db        = require('../utils/db')

const Model = Sequelize.Model
const ClientKnownPlanId = db.sequelize.define('client_known_plan_id', {
  client_id: {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    false
  },
  plan_id:   {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    true
  }
}, {
})


module.exports = ClientKnownPlanId
