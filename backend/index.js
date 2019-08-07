const app    = require('./app')
const config = require('./utils/config')
const http   = require('http')
const https  = require('https')
const fs     = require('fs')

if (config.PROTOCOL === "http") {
  const server = http.createServer(app)
  server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
  })
  
} else if (config.PROTOCOL === "https") {
  const options = {
    cert: fs.readFileSync(config.CERT),
    key:  fs.readFileSync(config.CERT_KEY)
  }
  
  const server = https.createServer(options, app)
  server.listen(config.PORT, () => {
    console.log(`Server (SSL) running on port ${config.PORT}`)
  })
  
} else {
  console.error(`Error, unknown protocol '${config.PROTOCOL}'`)
}


