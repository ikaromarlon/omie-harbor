const joi = require('joi')

const schema = joi.object({
  appKey: joi.string().trim().required(),
  appSecret: joi.string().trim().required(),
  data: joi.array().items().min(1).required(),
  batch: joi.string().default('1/1'),
  entity: joi.string().trim().required(),
  notificationAddress: joi.string().trim().email()
})

module.exports = schema
