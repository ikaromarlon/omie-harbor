module.exports = async ({
  omieService,
  credentials,
  company,
  omieCnae,
  companyMapping,
  repositories
}) => {
  const omieCompany = await omieService.getCompany(credentials)
  const companyData = companyMapping({ omieCompany, omieCnae, credentials })
  await repositories.companies.createOrUpdateOne({ _id: company._id }, companyData)
}
