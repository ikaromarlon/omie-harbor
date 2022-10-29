const ApplicationError = require('./ApplicationError')

module.exports = class ValidationError extends ApplicationError {
  constructor (message, data) {
    super(message, 422)
    this.name = 'ValidationError'
    if (data) this.data = data
  }
}
