/**
 * Extracts numeric digits from a string.
 *
 * @param {string|number} value - The input string or number from which to extract numeric digits.
 * @returns {string} Returns a new string containing only numeric digits.
 * @example
 * const result = getNumbers('abc123xyz') // Output: '123'
 * const result2 = getNumbers(45.67) // Output: '4567'
 */
module.exports = function getNumbers (value) {
  return String(value).replace(/[^0-9]/gi, '')
}
