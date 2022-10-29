const ApplicationError = require('./ApplicationError')

module.exports = class NotFoundError extends ApplicationError {
  constructor (message = 'Resource not found') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}
