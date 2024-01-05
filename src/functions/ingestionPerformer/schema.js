const joi = require('joi')

const schema = joi.object({
  companyId: joi.string().guid({ version: ['uuidv4'] }).required(),
  startDate: joi.date().iso(),
  endDate: joi.date().iso()
})

module.exports = schema
