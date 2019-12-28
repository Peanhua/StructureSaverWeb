const logger = require('./logger')
const config = require('./config')

const requestLogger = (request, response, next) => {
  logger.info('---')
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  logger.error("Unknown Endpoint:", request)
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  //  if(config.NODE_ENV !== 'test')
  logger.error("ERROR:", error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'Invalid id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })

  } else if(error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Invalid token' })

  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  const authschema = 'bearer '
  if(authorization && authorization.toLowerCase().startsWith(authschema)) {
    request.token = authorization.substring(authschema.length)
  }

  next()
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}
