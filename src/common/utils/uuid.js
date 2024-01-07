const { randomUUID } = require('node:crypto')

module.exports = function uuid () {
  return randomUUID()
}
