const log = ({ title, message, data }) => {
  const logData = JSON.stringify({
    message,
    timestamp: new Date(),
    data
  }, null, 2)
  return `${title ? `${title}:` : ''}\n${logData}`.trim()
}

module.exports = {
  info: ({ title, message, data }) => console.info(log({ title, message, data })),
  error: ({ title, message, data }) => console.error(log({ title, message, data }))
}
