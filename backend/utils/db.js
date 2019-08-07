const Sequelize = require('sequelize')

const sequelize = new Sequelize('structuresaver', null, null, {
  dialect: 'postgres',
  host: '/tmp'
})

const initialize = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection to the database has been established successfully.')
  } catch (exception) {
    console.error('Unable to connect to the database:', exception);
  }
}
  

const db = {
  sequelize:  sequelize,
  initialize: initialize
}

module.exports = db
