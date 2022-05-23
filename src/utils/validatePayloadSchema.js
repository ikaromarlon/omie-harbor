const { ValidationError } = require('./errors')

module.exports = (payload, schema) => {
  const { error, value } = schema.validate(payload, { abortEarly: false })
  if (error) throw new ValidationError(error.message)
  return value
}
