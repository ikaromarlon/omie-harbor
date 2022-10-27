const joi = require('joi')

const schema = joi.object({
  appKey: joi.string().trim().required(),
  appSecret: joi.string().trim().required()
})

module.exports = schema
