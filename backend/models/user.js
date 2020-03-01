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
  },
  steam_id: {
    type:         Sequelize.STRING,
    allowNull:    true
  }
}, {
})



User.passwordToHash = async (password) => {
  const salt_rounds = 10
  return await bcrypt.hash(password, salt_rounds)
}

User.changePassword = async (user, new_password) => {
  const password_hash = await User.passwordToHash(new_password)
  
  user.password_hash = password_hash
  user.save()
}


module.exports = User
