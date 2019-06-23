require('dotenv')
  .config({
    silent: process.env.NODE_ENV === 'production'
  })

let PORT = 3001


module.exports = {
  PORT
}
