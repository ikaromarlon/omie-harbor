/**
 * Multiplies two values with precision up to two decimal places.
 *
 * @param {number} value1 - The first value to be multiplied.
 * @param {number} value2 - The second value to be multiplied.
 * @returns {number} Returns the result of multiplying the two values with precision
 * up to two decimal places.
 * @example
 * const result = multiply(2, 3.5) // Output: 7
 * const result2 = multiply(1.23, 4.56) // Output: 5.6088
 */
module.exports = function multiply (value1 = 0, value2 = 0) {
  const precision = 100 // two decimal places
  const multiplier = precision * precision
  return Math.round((value1 * precision) * (value2 * precision)) / multiplier
}
