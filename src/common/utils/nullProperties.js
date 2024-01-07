/**
 * Recursively replaces non-object properties with null or empty objects in an object or array.
 *
 * @param {*} data - The data (object or array) to process.
 * @param {boolean} [forceEmptySecondLevelObjects=false] - If true, replaces properties in the second level with empty objects.
 * @returns {*} Returns a new object or array with non-object properties replaced by null or empty objects.
 * @example
 * const data = { a: 1, b: { c: 2, d: 'hello' }, e: [3, { f: null }] };
 * const result = nullProperties(data) // Output: { a: 1, b: { c: 2, d: null }, e: [3, { f: null }] }
 */
module.exports = function nullProperties (data, forceEmptySecondLevelObjects = false) {
  if (typeof data !== 'object' || !data) return null
  const _data = Array.isArray(data) ? [] : {}
  for (const key in data) {
    if (forceEmptySecondLevelObjects) {
      if (typeof data[key] !== 'object' || !data[key]) {
        _data[key] = null
      } else {
        _data[key] = Array.isArray(data[key]) ? [] : {}
      }
    } else {
      _data[key] = nullProperties(data[key])
    }
  }
  return _data
}
