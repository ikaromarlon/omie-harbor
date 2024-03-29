const ApplicationError = require('./ApplicationError')

const isApplicationError = error => error instanceof ApplicationError

const isClientSideError = error => String(error.statusCode).match(/4\d{2}/)

const isServerSideError = error => String(error.statusCode).match(/5\d{2}/)

module.exports = {
  isApplicationError,
  isClientSideError,
  isServerSideError
}
