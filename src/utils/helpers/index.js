const { randomUUID: uuid } = require('crypto')
const uuidFrom = require('uuid-by-string')

const getNumbers = (value) => String(value).replace(/[^0-9]/gi, '')

const removeUndefinedFields = (obj) => {
  const newObj = {}
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeUndefinedFields(obj[key])
    else if (obj[key] !== undefined) newObj[key] = obj[key]
  })
  return newObj
}

const validateCnpj = (value) => {
  value = getNumbers(value)
  if (
    value === '' ||
    value.length !== 14 ||
    value === '00000000000000' ||
    value === '11111111111111' ||
    value === '22222222222222' ||
    value === '33333333333333' ||
    value === '44444444444444' ||
    value === '55555555555555' ||
    value === '66666666666666' ||
    value === '77777777777777' ||
    value === '88888888888888' ||
    value === '99999999999999'
  ) {
    return false
  }
  let len = value.length - 2
  let numbers = value.substring(0, len)
  const digits = value.substring(len)
  let sum = 0
  let pos = len - 7
  for (let i = len; i >= 1; i--) {
    sum += numbers.charAt(len - i) * pos--
    if (pos < 2) pos = 9
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== +digits.charAt(0)) return false
  len += 1
  numbers = value.substring(0, len)
  sum = 0
  pos = len - 7
  for (let i = len; i >= 1; i--) {
    sum += numbers.charAt(len - i) * pos--
    if (pos < 2) pos = 9
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== +digits.charAt(1)) return false
  return true
}

const dateFormat = (value, { locale = '', format = '', localeOptions = {}, formatOptions = {} }) => {
  if (value) {
    const [date, time] = value.split('T')
    if (locale) return new Date(`${date}T${time || '00:00:00.000'}`)[localeOptions.dateOnly || false ? 'toLocaleDateString' : 'toLocaleString'](locale, localeOptions.format || {})
    if (format) return // manual implementation or use a third-party dependency formatter
  }
  return value
}

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

const millisecondsToDays = (milliseconds) => milliseconds / 8.64e+7

const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, secondsToMilliseconds(seconds)))

const isEmpty = (value) => !value || (typeof value === 'object' && !Object.keys(value).length)

const tryJsonParse = (value) => { try { return JSON.parse(value) } catch (err) { return value } }

const isObject = (value) => value !== null && !Array.isArray(value) && typeof value === 'object'

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

const upperCaseFirst = (value) => String(value).replace(/^.{1}/, (chr) => chr.toUpperCase())

const multiply = (value1, value2) => (((value1 * 100) * (value2 * 100)) / 100) / 100

module.exports = {
  getNumbers,
  uuid,
  uuidFrom,
  removeUndefinedFields,
  validateCnpj,
  dateFormat,
  isoDateToBR,
  brDateToISO,
  millisecondsToSeconds,
  secondsToMilliseconds,
  sleep,
  daysToMilliseconds,
  millisecondsToDays,
  isEmpty,
  tryJsonParse,
  isObject,
  emptyProperties,
  upperCaseFirst,
  multiply
}
