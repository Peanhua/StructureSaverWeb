#!/usr/bin/env node

const http    = require('http')
const fs      = require('fs')
const process = require('process')


const usage = () => {
  console.error(`Usage: ${process.argv[1]} <file.json>`)
}

if (process.argv.length !== 3) {
  console.error('Incorrect number of arguments')
  usage()
  process.exit(1)
}


const json = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const path = json.path
const data = JSON.stringify(json.data)

const options = {
  hostname: 'localhost',
  port: 3001,
  path: path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}


const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
    process.stdout.write('\n')
  })
})


req.on('error', error => {
  console.error(error)
})

req.write(data)
req.end()
