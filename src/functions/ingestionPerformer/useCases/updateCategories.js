module.exports = async ({
  omieService,
  credentials,
  companyId,
  categoryMapping,
  categoriesRepository
}) => {
  const omieCategories = await omieService.getCategories(credentials)
  const categories = omieCategories.map(omieCategory => categoryMapping({ omieCategory, companyId }))
  if (categories.length) {
    await categoriesRepository.createOrUpdateMany(categories, ['companyId', 'externalId'])
  }
}
