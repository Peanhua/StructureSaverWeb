const Sequelize          = require('sequelize')
const db                 = require('../utils/db')

const Model = Sequelize.Model
const PlayerMemory = db.sequelize.define('player_memory', {
  player_id: {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    true
  },
  memory: {
    type:      Sequelize.JSON,
    allowNull: false,
    unique:    false
  }
}, {
})

const PlayerMemoryPlanId = require('./playerMemoryPlanId')
PlayerMemory.hasMany(PlayerMemoryPlanId, {
  sourceKey: 'player_id',
  foreignKey: {
    name: 'player_id',
    allowNull: false
  }
})


//PlayerMemory.sync()



PlayerMemory.getMissingPlayerIds = async (having_player_ids) => {
  //console.log('getMissingPlayerIds(having_player_ids =', having_player_ids, ')')
  const existing_ids = await PlayerMemory.findAll({
    attributes: ['player_id'],
    where: {
      player_id: {
        [Sequelize.Op.in]: having_player_ids
      }
    }
  }).map(player => player.player_id)
  
  const missing_player_ids = having_player_ids.filter(id => !existing_ids.find((find_id) => { return find_id === id }))

  return missing_player_ids
}

PlayerMemory.getPlayerIdsNotListed = async (listed_player_ids) => {
  //console.log(`getPlayerIdsNotListed(${listed_player_ids})`)
  const res = await PlayerMemory.findAll({
    attributes: ['player_id'],
    where: {
      player_id: {
        [Sequelize.Op.notIn]: listed_player_ids
      }
    }
  })

  const other_player_ids = res.map(mem => mem.player_id)

  return other_player_ids
}

PlayerMemory.getNextPlayerMemoryToSend = async (known_player_ids) => {
  //console.log('PlayerMemory.getNextPlayerMemoryToSend(known_player_ids =', known_player_ids, ')')
  const player_ids = await PlayerMemory.getPlayerIdsNotListed(known_player_ids)
  if (player_ids.length === 0) {
    return null
  }

  //console.log("Retrieve first not-known player, id =", player_ids[0])
  const rv = await PlayerMemory.findOne({
    where: {
      player_id: player_ids[0]
    }
  })

  return rv
}


module.exports = PlayerMemory
