/**
 * Checks if a given value is a non-null object (excluding arrays).
 *
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the value is a non-null object, `false` otherwise.
 * @example
 * const result = isObject({ key: 'value' }) // Output: true
 *
 * const result2 = isObject([1, 2, 3]) // Output: false
 */
module.exports = function isObject (value) {
  return !!value &&
    typeof value === 'object' &&
    value instanceof Object &&
    !Array.isArray(value)
}
