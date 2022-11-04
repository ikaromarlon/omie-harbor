const joi = require('joi')

const schema = joi.object({
  topic: joi.string().required(),
  event: joi.object().unknown(true).required(),
  appKey: joi.string().required()
}).unknown(true)

module.exports = schema
