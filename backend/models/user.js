const Sequelize = require('sequelize')
const bcrypt    = require('bcrypt')

const sequelize = new Sequelize('structuresaver', null, null, {
  dialect: 'postgres',
  host: '/tmp'
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Model = Sequelize.Model
const User = sequelize.define('account', {
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


const initialize = async () => {
  await User.sync()
  
  const res = await User.findAll({})

  if (res.length === 0) {
    const password_hash = await User.passwordToHash('aaa')
    
    User.create({
      username:      'root',
      name:          'Administrator',
      password_hash: password_hash,
      is_admin:      true
    })
  }
}

initialize()

module.exports = User
