module.exports = async ({
  omieService,
  credentials,
  company,
  omieCnae,
  companyMapping,
  companiesRepository
}) => {
  const omieCompany = await omieService.getCompany(credentials)
  const companyData = companyMapping({ omieCompany, omieCnae, credentials })
  await companiesRepository.update({ id: company.id, ...companyData })
}
