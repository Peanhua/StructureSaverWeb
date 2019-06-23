const bcrypt = require('bcrypt')

const User = require('../models/user')

const saltRounds = 10


const usersInDb = async () => {
  const users = await User.findAll()
  return users
}

const getRandomUserId = async () => {
  const users = await User.findAll()
  return users[0].id
}

module.exports = {
  usersInDb,
  getRandomUserId
}
