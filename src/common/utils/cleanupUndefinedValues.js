const isObject = require('./isObject')

/**
 * Recursively removes properties with undefined values from an object or array.
 *
 * @param {*} data - The data (object or array) to clean up.
 * @returns {*} Returns a new object or array with undefined values removed.
 * @example
 * const data = { a: 1, b: undefined, c: { d: 2, e: undefined } }
 * const result = cleanupUndefinedValues(data) // Output: { a: 1, c: { d: 2 } }
 */
module.exports = function cleanupUndefinedValues (data) {
  if (isObject(data) && !(data instanceof Date)) {
    const newData = {}
    for (const key in data) {
      if (typeof data[key] !== 'undefined') {
        newData[key] = cleanupUndefinedValues(data[key])
      }
    }
    return newData
  }
  if (Array.isArray(data)) {
    const newData = []
    for (const i in data) {
      if (typeof data[i] !== 'undefined') {
        newData.push(cleanupUndefinedValues(data[i]))
      }
    }
    return newData
  }
  return data
}
