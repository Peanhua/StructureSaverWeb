const Sequelize = require('sequelize')
const db        = require('../utils/db')

const Model = Sequelize.Model
const ClientKnownPlanId = db.sequelize.define('client_known_plan_id', {
  client_id: {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    'client_id_plan_id'
  },
  plan_id:   {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    'client_id_plan_id'
  }
}, {
})


module.exports = ClientKnownPlanId
