const ApplicationError = require('./ApplicationError')
const HttpStatus = require('../helpers/HttpStatus')

class HttpException extends ApplicationError {
  constructor (statusCode, message, data) {
    if (!statusCode) throw new Error('statusCode is required')
    if (!message) throw new Error('message is required')
    super(message)
    this.statusCode = statusCode
    this.data = data instanceof Error ? { message: data.message, ...data } : data
  }
}

class BadRequestException extends HttpException {
  constructor (message, data) {
    super(
      HttpStatus.BAD_REQUEST,
      message ?? 'Invalid request',
      data
    )
  }
}

class NotFoundException extends HttpException {
  constructor (message, data) {
    super(
      HttpStatus.NOT_FOUND,
      message ?? 'Resource not found',
      data
    )
  }
}

class UnprocessableEntityException extends HttpException {
  constructor (message, data) {
    super(
      HttpStatus.UNPROCESSABLE_ENTITY,
      message ?? 'Invalid request payload',
      data
    )
  }
}

class InternalServerErrorException extends HttpException {
  constructor (message, data) {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      message ?? 'Something went wrong...',
      data
    )
  }
}

class BadGatewayException extends HttpException {
  constructor (message, data) {
    super(
      HttpStatus.BAD_GATEWAY,
      message ?? 'An external service has broken',
      data
    )
  }
}

module.exports = {
  HttpException,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
  InternalServerErrorException,
  BadGatewayException
}
