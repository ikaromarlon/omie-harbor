const log = (type, message, data) => JSON.stringify({
  message,
  type,
  timestamp: new Date(),
  data
}, null, 2)

module.exports = {
  info: (message, data) => console.info(log(
    'INFO',
    message,
    data
  )),
  error: (message, data) => console.error(log(
    'ERROR',
    message,
    data
  ))
}
