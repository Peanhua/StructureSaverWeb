const Sequelize = require('sequelize')
const db        = require('../utils/db')

const Model = Sequelize.Model
const Plan = db.sequelize.define('plan', {
  plan_id: {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    true
  },
  player_id: {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    false
  },
  data: {
    type:      Sequelize.JSON,
    allowNull: false
  }
}, {
})

//Plan.sync()


Plan.getMissingPlanIds = async (having_plan_ids) => {
  console.log('Plan.getMissingPlanIds(having_plan_ids =', having_plan_ids, ')')
  const existing_ids = await Plan.findAll({
    attributes: ['plan_id'],
    where: {
      plan_id: {
        [Sequelize.Op.in]: having_plan_ids
      }
    }
  }).map(plan => plan.plan_id)
  
  const missing_plan_ids = having_plan_ids.filter(id => !existing_ids.find((find_id) => { return find_id === id }))

  return missing_plan_ids
}

Plan.getPlanIdsNotListed = async (listed_plan_ids) => {
  console.log(`Plan.getPlanIdsNotListed(${listed_plan_ids})`)
  const res = await Plan.findAll({
    attributes: ['plan_id'],
    where: {
      plan_id: {
        [Sequelize.Op.notIn]: listed_plan_ids
      }
    }
  })

  const other_plan_ids = res.map(plan => plan.plan_id)

  return other_plan_ids
}

Plan.getNextPlanToSend = async (known_plan_ids) => {
  // todo: do this smarter: use the client_id as parameter instead of known_plan_ids and do the stuff in SQL
  //  console.log('Plan.getNextPlanToSend(known_plan_ids =', known_plan_ids, ')')
  const plan_ids = await Plan.getPlanIdsNotListed(known_plan_ids)
  if (plan_ids.length === 0) {
    return null
  }

  // console.log("Retrieve first not-known plan, id =", plan_ids[0])
  const rv = await Plan.findOne({
    where: {
      plan_id: plan_ids[0]
    }
  })

  return rv
}


module.exports = Plan
