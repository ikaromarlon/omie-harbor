const joi = require('joi')

const arrayOfUuidsSchema = joi.array().items(joi.string().guid({ version: ['uuidv4'] })).min(1)

const schema = joi.object({
  companyId: joi.alternatives().try(
    joi.string().custom((input, helper) => {
      const { error, value } = (joi.object({ companyId: arrayOfUuidsSchema }).validate({ companyId: input.split(',') }, { abortEarly: false }))
      if (error) return helper.message(error.message)
      return value.companyId.length === 1 ? value.companyId[0] : value.companyId
    }),
    arrayOfUuidsSchema
  ),
  startDate: joi.date().iso().optional(),
  endDate: joi.date().iso().optional()
})

module.exports = schema
