const { randomUUID: uuid } = require('crypto')
const uuidFrom = require('uuid-by-string')

const getNumbers = (value) => String(value).replace(/[^0-9]/gi, '')

const isoDateToBR = (value) => {
  const [date, time] = new Date(value).toISOString().split('T')
  return [date.split('-').reverse().join('/'), time]
}

const brDateToISO = (date, time = '') => {
  const d = date.split('/').reverse().join('-')
  if (!time) return d
  const { TZ } = process.env
  process.env.TZ = 'America/Sao_Paulo'
  const isoString = new Date(`${d}T${time}`).toISOString()
  if (TZ) process.env.TZ = TZ
  else delete process.env.TZ
  return isoString
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

const multiply = (value1, value2) => (((value1 * 100) * (value2 * 100)) / 100) / 100

const sleep = (seconds) => {
  if (seconds) return new Promise(resolve => setTimeout(resolve, secondsToMilliseconds(seconds)))
}

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
  sleep
}
