const { NotFoundException } = require('../../common/errors')

module.exports = ({
  companiesRepository,
  repositories,
  s3,
  logger
}) => async (payload) => {
  const { companyId } = payload

  const company = await companiesRepository.findById(companyId)

  if (!company) {
    throw new NotFoundException('Company not found')
  }

  logger.info(`Fetching data from database for company ${company.id} - ${company.name}`)

  const repos = Object.keys(repositories)

  const result = await Promise.all(
    repos.map(name => repositories[name].findMany({ companyId }))
  )

  const records = repos.reduce((acc, name, i) => {
    acc[name] = result[i]
    return acc
  }, {})

  logger.info(`Uploading data to s3 for company ${company.is} - ${company.name}`)

  await s3.storeCompanyData(companyId, {
    company,
    ...records
  })

  logger.info(`Data export completed for company ${company.is} - ${company.name}`)

  return { success: true }
}
