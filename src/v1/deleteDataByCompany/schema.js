const joi = require('joi')

const schema = joi.object({
  id: joi.string().guid({ version: ['uuidv4'] }).required()
})

module.exports = schema
