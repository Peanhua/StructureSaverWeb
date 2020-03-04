const db     = require('./utils/db')
const app    = require('./app')
const config = require('./utils/config')
const http   = require('http')
const https  = require('https')
const fs     = require('fs')
const User   = require('./models/user')

const createDefaultUser = async () => {
  const root = await User.findOne()
  if (root === null) {

    const password_hash = await User.passwordToHash('aaa')

    User.create({
      username:      'root',
      name:          'Administrator',
      password_hash: password_hash,
      is_admin:      true
    })
  }
}


db.initialize().then(() => {

  createDefaultUser()
  
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
})
