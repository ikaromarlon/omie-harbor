const { NotFoundException, ConflictException } = require('../../common/errors')

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

  if (!omieCompany) {
    throw new NotFoundException('Company not found at Omie. Check the AppKey and AppSecret and try again.')
  }

  const omieCnae = await omieService.getCnae(credentials)

  const companyData = companyMapping({ omieCompany, omieCnae, credentials })

  const company = await companiesRepository.create(companyData)

  return company
}
