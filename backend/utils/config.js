require('dotenv')
  .config({
    silent: process.env.NODE_ENV === 'production'
  })

const PORT     = process.env.PORT     !== undefined ? process.env.PORT :     3001
const PROTOCOL = process.env.PROTOCOL !== undefined ? process.env.PROTOCOL : "http"
const CERT     = process.env.CERT     !== undefined ? process.env.CERT :     "cert.pem"
const CERT_KEY = process.env.CERT_KEY !== undefined ? process.env.CERT_KEY : "key.pem"


module.exports = {
  PORT,
  PROTOCOL,
  CERT,
  CERT_KEY
}
