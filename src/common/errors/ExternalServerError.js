const ApplicationError = require('./ApplicationError')

module.exports = class ExternalServerError extends ApplicationError {
  constructor (message, data) {
    super(message, 502)
    this.name = 'ExternalServerError'
    if (data) this.data = { message: data.message, ...data }
  }
}
