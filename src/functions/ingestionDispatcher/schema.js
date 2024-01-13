const joi = require('joi')

const schema = joi.object({
  companyId: joi.array().items(joi.string()).min(1).required(),
  startDate: joi.date().iso().optional(),
  endDate: joi.date().iso().optional()
})

module.exports = schema
