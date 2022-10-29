const ApplicationError = require('./ApplicationError')
const ExternalServerError = require('./ExternalServerError')
const InternalServerError = require('./InternalServerError')
const NotFoundError = require('./NotFoundError')
const ValidationError = require('./ValidationError')

const isClientError = error => [
  NotFoundError.name,
  ValidationError.name
].includes(error.name)

module.exports = {
  ApplicationError,
  ExternalServerError,
  InternalServerError,
  NotFoundError,
  ValidationError,
  isClientError
}
