const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const ERROR_HANDLERS = {
    CastError: res =>
        res.status(400).send({ error: 'id used is malformed' }),

    ValidationError: (res, { message }) =>
        res.status(409).send({ error: message }),

    JsonWebTokenError: (res) =>
        res.status(401).json({ error: 'token missing or invalid' }),

    defaultError: (res, error) => {
        console.error(error.name)
        res.status(500).end()
    }
}

const errorHandler = (error, request, response, next) => {
    const handler =
        ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

    handler(response, error)
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    let token = ''

    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7)
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const { id: userId } = decodedToken

    request.user = userId
    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor
}
