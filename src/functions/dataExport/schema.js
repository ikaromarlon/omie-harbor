const joi = require('joi')

const schema = joi.object({
  companyId: joi.string().required()
})

module.exports = schema
