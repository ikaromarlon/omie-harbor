module.exports = ({
  repositories
}) => async ({ payload }) => {
  const { companyId } = payload

  const deletableRepositories = Object.values(repositories).filter(repository => repository.allowDeleteByCompany)

  await Promise.all(deletableRepositories.map(async repository => repository.deleteMany({ _id: companyId })))

  return { success: true }
}
