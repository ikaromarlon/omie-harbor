class ApplicationError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.name = 'ApplicationError'
    this.statusCode = statusCode
  }
}

class AuthError extends ApplicationError {
  constructor (message) {
    super(message, 401)
    this.name = 'AuthError'
  }
}

class AccessDeniedError extends ApplicationError {
  constructor (message = 'User not allowed access this resource') {
    super(message, 403)
    this.name = 'AccessDeniedError'
  }
}

class NotFoundError extends ApplicationError {
  constructor (message) {
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

module.exports = {
  ApplicationError,
  NotFoundError,
  AuthError,
  AccessDeniedError,
  ValidationError,
  InternalServerError,
  ExternalServerError
}
