const joi = require('joi')

const schema = joi.object({
  companyId: joi.string().guid({ version: ['uuidv4'] }).required(),
  data: joi.array().items().min(1).required(),
  batch: joi.string().default('1/1'),
  entity: joi.string().trim().required(),
  notificationAddress: joi.string().trim().email(),
  userId: joi.string().guid({ version: ['uuidv4'] })
})

module.exports = schema
