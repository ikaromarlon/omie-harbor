const { UnprocessableEntityException } = require('../errors')

module.exports = (payload, schema) => {
  const { error, value } = schema.validate(payload, { abortEarly: false })
  if (error) throw new UnprocessableEntityException(error.message)
  return value
}
