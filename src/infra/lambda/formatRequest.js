const tryJsonParse = require('../../common/utils/tryJsonParse')

const handleHttp = ({
  headers,
  pathParameters,
  queryStringParameters,
  body
}) => ({
  headers: headers ?? null,
  params: pathParameters ?? null,
  query: queryStringParameters ?? null,
  body: body ? tryJsonParse(body) : null
})

const handleSqs = ({
  Records
}) => ({
  records: Records
    ? Records.map(e => ({
      ...e,
      body: tryJsonParse(e.body)
    }))
    : null
})

module.exports = (event) => ({
  ...handleHttp(event),
  ...handleSqs(event)
})
