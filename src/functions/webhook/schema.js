const joi = require('joi')

module.exports = joi.alternatives().try(
  joi.object({
    ping: joi.string().required()
  }),
  joi.object({
    topic: joi.string().required(),
    event: joi.object().required().unknown(true),
    appKey: joi.string().required()
  }).unknown(true)
)
