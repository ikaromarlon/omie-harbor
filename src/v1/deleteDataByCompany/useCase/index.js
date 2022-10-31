module.exports = ({
  repositories
}) => async ({ payload }) => {
  const { id } = payload

  const deletableRepositories = Object.values(repositories).filter(repository => repository.allowsDeleteAllData)

  const result = {}
  for (const repository of deletableRepositories) {
    result[repository.name] = await repository.deleteMany({ companyId: id })
  }

  const company = await repositories.companies.findOne({ _id: id })

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
