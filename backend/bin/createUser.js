#!/usr/bin/env node

const process = require('process')
const User    = require('../models/user')
const db      = require('../utils/db')

const usage = () => {
  console.error(`Usage: ${process.argv[1]} <username> <name> <password> <is_admin>`)
}

if (process.argv.length !== 6) {
  console.error('Incorrect number of arguments')
  usage()
  process.exit(1)
}

const username = process.argv[2]
const name     = process.argv[3]
const password = process.argv[4]
const is_admin = process.argv[5]

const main = async () => {
  await db.initialize()

  const password_hash = await User.passwordToHash('aaa')

  const saved = await User.create({
    username:      username,
    name:          name,
    password_hash: password_hash,
    is_admin:      is_admin
  })

  console.log(`Created new user '${saved.username}'`)
  db.sequelize.close()
}

main()
  .then()
  .catch(e => {
    console.error('Failed to create new user:')
    if (e.errors !== undefined)
      e.errors.forEach((error) => {
        console.error('  ' + error.message)
      })
    else if (e.name !== undefined)
      console.error(e.name + ' ' + e.parent.code)
    db.sequelize.close()
 })
