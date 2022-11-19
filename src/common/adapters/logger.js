const log = ({ title, message, data }) => `[${process.env.UUID}]${title ? ` ${title}:` : ''}${message ? ` ${message}` : ''}\n${JSON.stringify({ processId: process.env.UUID, timestamp: new Date(), message, data }, null, 2)}`

module.exports = {
  info: ({ title, message, data }) => console.info(log({ title, message, data })),
  error: ({ title, message, data }) => console.error(log({ title, message, data }))
}
