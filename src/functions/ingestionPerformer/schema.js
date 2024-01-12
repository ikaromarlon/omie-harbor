const joi = require('joi')

const schema = joi.object({
  companyId: joi.string().required(),
  startDate: joi.date().iso(),
  endDate: joi.date().iso()
})

module.exports = schema
