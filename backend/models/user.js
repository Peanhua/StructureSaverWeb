const Sequelize = require('sequelize')
const bcrypt    = require('bcrypt')
const db        = require('../utils/db')


const Model = Sequelize.Model
const User = db.sequelize.define('account', {
  username: {
    type:      Sequelize.STRING,
    unique:    true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password_hash: {
    type:      Sequelize.STRING,
    allowNull: false
  },
  is_admin: {
    type:         Sequelize.BOOLEAN,
    allowNull:    false,
    defaultValue: false
  }
}, {
})



User.passwordToHash = async (password) => {
  const salt_rounds = 10
  return await bcrypt.hash(password, salt_rounds)
}


module.exports = User
