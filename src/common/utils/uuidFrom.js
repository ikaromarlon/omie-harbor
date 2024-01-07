const uuidByString = require('uuid-by-string')

module.exports = function uuidFrom (value) {
  return uuidByString(value)
}
