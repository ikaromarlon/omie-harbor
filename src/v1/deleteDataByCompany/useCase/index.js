const { NotFoundError } = require('../../../common/errors')

module.exports = ({
  repositories
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
