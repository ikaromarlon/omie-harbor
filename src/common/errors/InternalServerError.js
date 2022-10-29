const ApplicationError = require('./ApplicationError')

module.exports = class InternalServerError extends ApplicationError {
  constructor (message, stack = null) {
    super(message, 500)
    this.name = 'InternalServerError'
    if (stack) this.stack = stack
  }
}
