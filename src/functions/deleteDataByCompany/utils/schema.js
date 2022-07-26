const joi = require('joi')

const schema = joi.object({
  companyId: joi.string().guid({ version: ['uuidv4'] }).required()
})

module.exports = schema
