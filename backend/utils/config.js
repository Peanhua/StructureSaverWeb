require('dotenv')
  .config({
    silent: process.env.NODE_ENV === 'production'
  })

const PORT      = process.env.PORT      !== undefined ? process.env.PORT :      3001
const PROTOCOL  = process.env.PROTOCOL  !== undefined ? process.env.PROTOCOL :  "http"
const CERT      = process.env.CERT      !== undefined ? process.env.CERT :      "cert.pem"
const CERT_KEY  = process.env.CERT_KEY  !== undefined ? process.env.CERT_KEY :  "key.pem"
const JWTSECRET = process.env.JWTSECRET !== undefined ? process.env.JWTSECRET : 'abc'
const NODE_ENV  = process.env.NODE_ENV  !== undefined ? process.env.NODE_ENV :  'test'

module.exports = {
  PORT,
  PROTOCOL,
  CERT,
  CERT_KEY,
  JWTSECRET,
  NODE_ENV
}
