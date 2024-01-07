/**
 * Converts a value representing seconds to milliseconds.
 *
 * @param {number} seconds - The number of seconds to be converted.
 * @returns {number} Returns the equivalent value in milliseconds.
 * @example
 * const result = secondsToMilliseconds(3) // Output: 3000
 * const result2 = secondsToMilliseconds(1.5) // Output: 1500
 */
module.exports = function secondsToMilliseconds (seconds) {
  return seconds * 1000
}
