const Sequelize = require('sequelize')

const sequelize = new Sequelize('structuresaver', null, null, {
  dialect: 'postgres',
  host: '/tmp'
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection (Plan) has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect (Plan) to the database:', err);
  });

const Model = Sequelize.Model
const Plan = sequelize.define('plan', {
  plan_id: {
    type:      Sequelize.STRING,
    allowNull: false,
    unique:    true
  },
  data: {
    type:      Sequelize.JSON,
    allowNull: false
  }
}, {
})

Plan.sync()


Plan.getMissingPlanIds = async (having_plan_ids) => {
  console.log("getMissingPlanIds()")

  const existing_ids = await Plan.findAll({
    attributes: ['plan_id'],
    where: {
      plan_id: {
        [Sequelize.Op.in]: having_plan_ids
      }
    }
  }).map(plan => plan.plan_id)
  
  console.log("plan_ids =", having_plan_ids)
  console.log("existing_ids =", existing_ids)

  const missing_plan_ids = having_plan_ids.filter(id => !existing_ids.find((find_id) => { return find_id === id }))

  console.log("missing_plan_ids =", missing_plan_ids)

  return missing_plan_ids
}


module.exports = Plan
