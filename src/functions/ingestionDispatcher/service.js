const { UnprocessableEntityException } = require('../../common/errors/httpErrors')

module.exports = ({
  companiesRepository,
  sqs,
  logger
}) => async (payload) => {
  const { companyId } = payload

  let filter = { isActive: true }
  if (companyId) {
    filter = { id: companyId }
  }

  const companies = await companiesRepository.find(filter)

  const invalidCompanies = companyId?.reduce((acc, id) => {
    const company = companies.find(c => c.id === id)
    if (!company) {
      acc[id] = 'not found'
      return acc
    }
    if (!company.isActive) {
      acc[id] = 'is not active'
      return acc
    }
    return acc
  }, {}) ?? {}

  if (Object.keys(invalidCompanies).length) {
    throw new UnprocessableEntityException('Invalid companies', { invalidCompanies })
  }

  const sent = await Promise.all(companies.map(async (company) => {
    await sqs.sendCompanyToIngestionQueue(company.id)
    return { id: company.id, name: company.name }
  }))

  logger.info(`${sent.length} company(ies) sent to ingestion queue`, { companies: sent })

  return { success: true }
}
