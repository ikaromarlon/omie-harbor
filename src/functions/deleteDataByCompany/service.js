const { NotFoundException } = require('../../common/errors')

module.exports = ({
  companiesRepository,
  repositories,
  logger,
  sqs
}) => async (payload) => {
  const { id: companyId } = payload

  const company = await companiesRepository.findById(companyId)

  if (!company) {
    throw new NotFoundException('Company not found')
  }

  const repos = Object.keys(repositories)

  const result = await Promise.all(
    repos.map(name => repositories[name].deleteMany({ companyId }))
  )

  const deletedRecords = repos.reduce((acc, name, i) => {
    acc[name] = result[i]
    return acc
  }, {})

  await sqs.sendCompanyToDataExportQueue(company.id)

  logger.info(`Company ${company.id} - ${company.name} sent to dataExport process`)

  return {
    company: {
      id: company.id,
      cnpj: company.cnpj,
      name: company.name
    },
    deletedRecords
  }
}
