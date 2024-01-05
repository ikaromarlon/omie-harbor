const joi = require('joi')

// const schema = joi.array().items(
//   joi.object({
//     topic: joi.string().required(),
//     event: joi.object().unknown(true).required(),
//     appKey: joi.string().required()
//   }).unknown(true)
// ).min(1)

const schema = joi.alternatives().try(
  joi.object({
    ping: joi.string().required()
  }),
  joi.object({
    topic: joi.string().required(),
    event: joi.object().unknown(true).required(),
    appKey: joi.string().required()
  }).unknown(true)
)

module.exports = schema
