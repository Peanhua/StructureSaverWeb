const Sequelize = require('sequelize')

const sequelize = new Sequelize('structuresaver', null, null, {
  dialect: 'postgres',
  host: '/tmp',
  logging: false
})

const initialize = async () => {
  try {
    await sequelize.authenticate()
  } catch (exception) {
    console.error('Unable to connect to the database:', exception);
  }

  await sequelize.sync()
}
  

const db = {
  sequelize:  sequelize,
  initialize: initialize
}

module.exports = db
