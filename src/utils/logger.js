module.exports = {
  info: ({ title, message, data }) => console.info(`[${process.env.UUID}]${title ? ` ${title}:` : ''}${message ? ` ${message}` : ''}\n${JSON.stringify({ processId: process.env.UUID, timestamp: new Date(), message, data }, null, 2)}`.trim()),
  error: ({ title, message, data }) => console.error(`[${process.env.UUID}]${title ? ` ${title}:` : ''}${message ? ` ${message}` : ''}\n${JSON.stringify({ processId: process.env.UUID, timestamp: new Date(), message, data }, null, 2)}`.trim())
}
