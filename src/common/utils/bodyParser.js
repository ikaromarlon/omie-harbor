const { tryJsonParse } = require('../helpers')

module.exports = ({ headers = {}, body, isBase64Encoded }) => {
  const boundary = headers['Content-Type'] ?? headers['content-type'] ?? 'application/json'

  const [contentType] = boundary.split(';')

  const parsers = {
    // 'multipart/form-data': () => null
  }

  const parser = parsers[contentType]

  if (!parser) return tryJsonParse(body) /* Default parser: try json or return body as is */

  return parser({ boundary, contentType, body, isBase64Encoded })
}
