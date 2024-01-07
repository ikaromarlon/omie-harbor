const secondsToMilliseconds = require('./secondsToMilliseconds')

/**
 * Sleeps (delays) for the specified number of seconds.
 *
 * @param {number} seconds - The number of seconds to sleep.
 * @returns {Promise<void>} A promise that resolves after the specified sleep duration.
 * @example
 * async function exampleUsage() {
 *   await sleep(2);
 * }
 * // Call the exampleUsage function
 * await exampleUsage();
 */
module.exports = function sleep (seconds) {
  return new Promise(resolve => setTimeout(resolve, secondsToMilliseconds(seconds)))
}
