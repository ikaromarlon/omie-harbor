const { randomUUID: uuid } = require('node:crypto')
const uuidFrom = require('uuid-by-string')
const config = require('../../config')

const getNumbers = (value) => String(value).replace(/[^0-9]/gi, '')

const isoDateToBR = (value) => {
  const [date, time] = new Date(value).toISOString().split('T')
  return [date.split('-').reverse().join('/'), time]
}

const brDateToISO = (date, time = '') => {
  const d = date.split('/').reverse().join('-')
  if (!time) return d
  const [h = 0, m = 0, s = 0, ms = 0] = time.split(/\D/).map(Number)
  const di = new Date(d)
  di.setUTCHours(h - config.app.brazilianOffSetTimeZone, m, s, ms)
  return di.toISOString()
}

const millisecondsToSeconds = (milliseconds) => milliseconds / 1000

const secondsToMilliseconds = (seconds) => seconds * 1000

const daysToMilliseconds = (days) => days * 8.64e+7

const tryJsonParse = (value) => { try { return JSON.parse(value) } catch (err) { return value } }

const emptyProperties = (data, forceEmptyFirstLevelObjects = false) => {
  if (typeof data !== 'object' || !data) return null
  const _data = Array.isArray(data) ? [] : {}
  for (const key in data) {
    if (forceEmptyFirstLevelObjects) {
      if (typeof data[key] !== 'object' || !data[key]) {
        _data[key] = null
      } else {
        _data[key] = Array.isArray(data[key]) ? [] : {}
      }
    } else {
      _data[key] = emptyProperties(data[key])
    }
  }
  return _data
}

const multiply = (value1 = 0, value2 = 0) => (((value1 * 100) * (value2 * 100)) / 100) / 100

const sleep = (seconds) => {
  if (seconds) return new Promise(resolve => setTimeout(resolve, secondsToMilliseconds(seconds)))
}

const stripTags = (value) => value.replace(/<[^>]*>?/gm, '')

module.exports = {
  getNumbers,
  uuid,
  uuidFrom,
  isoDateToBR,
  brDateToISO,
  millisecondsToSeconds,
  secondsToMilliseconds,
  daysToMilliseconds,
  tryJsonParse,
  emptyProperties,
  multiply,
  sleep,
  stripTags
}
