const { NotFoundException } = require('../../common/errors')

module.exports = ({
  Repositories,
  logger,
  queuer
}) => async (payload) => {
  const { id } = payload

  const repositories = await Repositories()

  const company = await repositories.companies.findOne({ _id: id })

  if (!company) {
    throw new NotFoundException('Company not found')
  }

  const deletableRepositories = Object.values(repositories).filter(repository => repository.allowsDeleteAllData)

  const result = {}
  for (const repository of deletableRepositories) {
    result[repository.name] = await repository.deleteMany({ companyId: id })
  }

  await queuer.sendCompanyToDataExportQueue(company._id)

  logger.info(`Company ${company._id} - ${company.name} sent to dataExport process`)

  return {
    success: true,
    company: {
      id: company._id,
      cnpj: company.cnpj,
      name: company.name
    },
    deletedRecords: result
  }
}
