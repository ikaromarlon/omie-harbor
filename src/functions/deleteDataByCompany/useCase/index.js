const { NotFoundError } = require('../../../common/errors')

module.exports = ({
  repositories,
  queuer,
  logger
}) => async ({ payload }) => {
  const { id } = payload

  const company = await repositories.companies.findOne({ _id: id })

  if (!company) {
    throw new NotFoundError('Company not found')
  }

  const deletableRepositories = Object.values(repositories).filter(repository => repository.allowsDeleteAllData)

  const result = {}
  for (const repository of deletableRepositories) {
    result[repository.name] = await repository.deleteMany({ companyId: id })
  }

  await queuer.sendCompanyToDataExportQueue(company._id)

  logger.info({
    title: 'deleteDataByCompany',
    message: `Company ${company._id} - ${company.name} sent to dataExport process`
  })

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
