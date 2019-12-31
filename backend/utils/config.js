require('dotenv')
  .config({
    silent: process.env.NODE_ENV === 'production'
  })

// Mandatory settings:
const DATABASE_NAME = process.env.DATABASE_NAME
// Optional settings:
const AUTOCREATE_STEAM_USERS = process.env.AUTOCREATE_STEAM_USERS !== undefined ? process.env.AUTOCREATE_STEAM_USERS : false
const CERT      = process.env.CERT      !== undefined ? process.env.CERT      : "cert.pem"
const CERT_KEY  = process.env.CERT_KEY  !== undefined ? process.env.CERT_KEY  : "key.pem"
const JWTSECRET = process.env.JWTSECRET !== undefined ? process.env.JWTSECRET : 'abc'
const NODE_ENV  = process.env.NODE_ENV  !== undefined ? process.env.NODE_ENV  : 'test'
const PORT      = process.env.PORT      !== undefined ? process.env.PORT      : 3001
const PROTOCOL  = process.env.PROTOCOL  !== undefined ? process.env.PROTOCOL  : "http"

module.exports = {
  AUTOCREATE_STEAM_USERS,
  CERT,
  CERT_KEY,
  DATABASE_NAME,
  JWTSECRET,
  NODE_ENV,
  PORT,
  PROTOCOL
}
