const joi = require('joi')

const schema = joi.object({
  id: joi.string().required()
})

module.exports = schema
