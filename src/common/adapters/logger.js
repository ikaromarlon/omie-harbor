const log = (type, message, data) => {
  const logData = JSON.stringify({
    type,
    timestamp: new Date(),
    message,
    data
  }, null, 2)
  return `${message ? `${message}\n` : ''}${logData}`
}

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
