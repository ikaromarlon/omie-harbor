const log = ({ title, message, data }) => `${title ? `${title}:` : ''}${message ? ` ${message}` : ''}\n${JSON.stringify({ message, data }, null, 2)}`.trim()

module.exports = {
  info: ({ title, message, data }) => console.info(log({ title, message, data })),
  error: ({ title, message, data }) => console.error(log({ title, message, data }))
}
