class ApplicationError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.name = 'ApplicationError'
    this.statusCode = statusCode
  }
}

class NotFoundError extends ApplicationError {
  constructor (message = 'Resource not found') {
    super(message, 404)
    this.name = 'NotFoundError'
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

const expectedErrors = [
  NotFoundError.name,
  ValidationError.name
]

module.exports = {
  ApplicationError,
  NotFoundError,
  ValidationError,
  InternalServerError,
  ExternalServerError,
  expectedErrors
}
