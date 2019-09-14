const Sequelize = require('sequelize')
const db        = require('../utils/db')

const Model = Sequelize.Model
const PlayerMemoryPlanId = db.sequelize.define('player_memory_plan_id', {
  player_id: {
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

//PlayerMemoryPlanId.sync()

module.exports = PlayerMemoryPlanId

