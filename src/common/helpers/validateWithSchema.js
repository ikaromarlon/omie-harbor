const { UnprocessableEntityException } = require('../errors')

/**
 * Validates data against a Joi schema and throws an exception if validation fails.
 *
 * @param {object} data - The data to be validated.
 * @param {Joi.Schema} schema - The Joi schema used for validation.
 * @throws {UnprocessableEntityException} Throws an exception with validation error message if validation fails.
 * @returns {object} The validated and parsed data.
 */
module.exports = (data, schema) => {
  const { error, value } = schema.validate(data, { abortEarly: false })
  if (error) throw new UnprocessableEntityException(error.message)
  return value
}
