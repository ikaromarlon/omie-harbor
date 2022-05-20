class ApplicationError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.name = 'ApplicationError'
    this.statusCode = statusCode
  }
}

class ValidationError extends ApplicationError {
  constructor (message) {
    super(message, 422)
    this.name = 'ValidationError'
  }
}

class InternalServerError extends ApplicationError {
  constructor (message, stack = null) {
    super(message, 500)
    this.name = 'InternalServerError'
    if (stack) this.stack = stack
  }
}
class ExternalServerError extends ApplicationError {
  constructor (message, externalCallData) {
    super(message, 502)
    this.name = 'ExternalServerError'
    if (externalCallData) this.externalCallData = { message: externalCallData.message, ...externalCallData }
  }
}

module.exports = {
  ApplicationError,
  ValidationError,
  InternalServerError,
  ExternalServerError
}
