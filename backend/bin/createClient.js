#!/usr/bin/env node

const process = require('process')
const Client  = require('../models/client')
const db      = require('../utils/db')

const usage = () => {
  console.error(`Usage: ${process.argv[1]} <client_id> <password>`)
}

if (process.argv.length !== 4) {
  console.error('Incorrect number of arguments')
  usage()
  process.exit(1)
}

const client_id = process.argv[2]
const password  = process.argv[3]

db.initialize()
  .then(() => {
    Client.createNewClient(client_id, password)
      .then((saved) => {
        console.log(`Created new client '${saved.client_id}'`)
        db.sequelize.close()
      })
      .catch((e) => {
        console.error('Failed to create new client:')
        e.errors.forEach((error) => {
          console.error('  ' + error.message)
        })
        db.sequelize.close()
      })
  })
  .catch((e) => {
    console.error('Failed to initialize the database:')
    console.log(e)
  })
