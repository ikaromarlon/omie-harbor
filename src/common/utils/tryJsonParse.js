/**
 * Attempts to parse a JSON string and returns the parsed object. If parsing fails,
 * it returns the original value.
 *
 * @param {string} data - The JSON string to parse.
 * @returns {object|string} Returns the parsed object if successful, or the original
 * string if parsing fails.
 * @example
 * const result = tryJsonParse('{"key": "value"}') // Output: { key: 'value' }
 * const result2 = tryJsonParse('invalid json') // Output: 'invalid json'
 */
module.exports = function tryJsonParse (data) {
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}
