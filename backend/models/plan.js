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


module.exports = Plan
