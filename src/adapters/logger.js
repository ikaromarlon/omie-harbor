module.exports = () => {
  const { UUID } = process.env
  return {
    info: ({ title, message, data = null }) => console.info(`${title} ${UUID}\n${JSON.stringify({ UUID, data, message, timestamp: new Date() }, null, 2)}`),
    error: ({ title, message, data = null }) => console.error(`${title} ${UUID}\n${JSON.stringify({ UUID, data, message, timestamp: new Date() }, null, 2)}`)
  }
}
