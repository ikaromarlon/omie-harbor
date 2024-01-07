/**
 * Converts a Brazilian date string (DD/MM/YYYY) with an optional time string to ISO 8601 format.
 *
 * @param {string} brDate - The Brazilian date string in DD/MM/YYYY format.
 * @param {string} [time=''] - The optional time string in HH:mm:ss.SSS format.
 * @returns {string} Returns the ISO 8601 formatted date string.
 * @example
 * const result = brDateToISO('31/12/2022') // Output: '2022-12-30T21:00:00.000Z'
 * const result2 = brDateToISO('01/01/2023', '12:30:45.500') // Output: '2023-01-01T15:30:45.500Z'
 */
module.exports = function brDateToISO (brDate, time = '') {
  /**
   * Offset for Brazilian time zone (UTC-3).
   * @constant {number}
   */
  const BR_OFFSET_TIME = 3

  /**
   * Converts the Brazilian date string to ISO 8601 format.
   *
   * @type {string}
   */
  const isoDate = brDate.split('/').reverse().join('-')

  const isoDateTime = new Date(isoDate)

  if (!time) {
    isoDateTime.setUTCHours(BR_OFFSET_TIME)
  } else {
    const [hours = 0, minutes = 0, seconds = 0, milliseconds = 0] = time.split(/\D/).map(Number)
    isoDateTime.setUTCHours(hours + BR_OFFSET_TIME, minutes, seconds, milliseconds)
  }

  return isoDateTime.toISOString()
}
