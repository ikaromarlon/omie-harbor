/**
 * Converts a value representing a number of days to milliseconds.
 *
 * @param {number} days - The number of days to be converted.
 * @returns {number} Returns the equivalent value in milliseconds.
 * @example
 * const result = daysToMilliseconds(2) // Output: 172800000
 * const result2 = daysToMilliseconds(1.5) // Output: 129600000
 */
module.exports = function daysToMilliseconds (days) {
  return days * 8.64e+7
}
