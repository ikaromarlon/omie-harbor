/**
 * Converts an ISO date string to Brazilian date format.
 *
 * @param {string} isoDate - The ISO date string to be converted.
 * @returns {Object} An object containing the Brazilian date and time.
 *   - `date` (string): The Brazilian date in the format DD/MM/YYYY.
 *   - `time` (string): The time in the format HH:mm:ss.sss (if available).
 *
 * @example
 * // Returns { date: '31/12/2022', time: '00:00:00.000' }
 * isoDateToBR('2022-12-31');
 *
 * @example
 * // Returns { date: '01/01/2023', time: '00:00:00.000' }
 * isoDateToBR('2023-01-01T00:00:00.000');
 *
 * @example
 * // Returns { date: '31/12/2022', time: '21:00:00.000' }
 * isoDateToBR('2023-01-01T00:00:00.000Z');
 *
 * @example
 * // Returns { date: '01/01/2023', time: '20:59:59.999' }
 * isoDateToBR('2023-01-01T23:59:59.999Z');
 */
module.exports = function isoDateToBR (isoDate) {
  /**
   * Offset for Brazilian time zone (UTC-3).
   * @constant {number}
   */
  const BR_OFFSET_TIME = 3

  const [d, t] = isoDate.split('T')

  const dateInstance = new Date(d)

  if (t) {
    const [h = 0, m = 0, s = 0, ms = 0] = t.split(/\D/).map(Number)

    dateInstance.setUTCHours(
      t.includes('Z') ? h - BR_OFFSET_TIME : h,
      m,
      s,
      ms
    )
  }

  const [date, time] = dateInstance.toISOString().split('T')

  return {
    date: date.split('-').reverse().join('/'),
    time: time.replace('Z', '')
  }
}
