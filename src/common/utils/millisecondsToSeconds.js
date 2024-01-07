/**
 * Converts a value representing milliseconds to seconds.
 *
 * @param {number} ms - The number of milliseconds to be converted.
 * @returns {number} Returns the equivalent value in seconds.
 * @example
 * const result = millisecondsToSeconds(3000) // Output: 3
 * const result2 = millisecondsToSeconds(1500) // Output: 1.5
 */
module.exports = function millisecondsToSeconds (ms) {
  return ms / 1000
}
