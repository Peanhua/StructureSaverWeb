const Sequelize = require('sequelize')
const config    = require('./config')

const sequelize = new Sequelize(config.DATABASE_NAME, config.DATABASE_USERNAME, config.DATABASE_PASSWORD, {
  dialect: 'postgres',
  host:    config.DATABASE_HOST,
  port:    config.DATABASE_PORT,
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
