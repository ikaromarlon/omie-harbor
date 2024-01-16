const { ConflictException } = require('../../common/errors')

module.exports = ({
  omieService,
  companyMapping,
  companiesRepository
}) => async ({ appKey, appSecret }) => {
  const credentials = { appKey, appSecret }

  const hasCompany = await companiesRepository.findByCredentials(appKey, appSecret)

  if (hasCompany) {
    throw new ConflictException('Company with provided credentials already exists.')
  }

  const omieCompany = await omieService.getCompany(credentials, true)

  const omieCnae = await omieService.getCnae(credentials)

  const companyData = companyMapping({ omieCompany, omieCnae, credentials })

  const company = await companiesRepository.create(companyData)

  return company
}
