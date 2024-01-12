const joi = require('joi')

const schema = joi.object({
  id: joi.string(),
  isActive: joi.when('id', {
    not: joi.exist(),
    then: joi.boolean()
  })
})

module.exports = schema
