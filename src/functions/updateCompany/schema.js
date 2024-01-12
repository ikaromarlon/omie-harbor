const joi = require('joi')

const schema = joi.object({
  id: joi.string().required(),
  isActive: joi.boolean().required()
})

module.exports = schema
