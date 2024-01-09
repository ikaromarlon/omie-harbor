const { NotFoundException } = require('../../common/errors')

module.exports = ({
  omieService,
  companyMapping,
  Repositories
}) => async (payload) => {
  const credentials = {
    appKey: payload.appKey.trim(),
    appSecret: payload.appSecret.trim()
  }

  const repositories = await Repositories()

  const company = await repositories.companies.findOne({ credentials })
  if (company) return company

  const omieCompany = await omieService.getCompany(credentials, true)

  if (!omieCompany) {
    throw new NotFoundException('Company not found in Omie service. Check the AppKey and AppSecret and try again.')
  }

  const omieCnae = await omieService.getCnae(credentials)

  const companyData = companyMapping({ omieCompany, omieCnae, credentials })

  return repositories.companies.createOrUpdateOne({ credentials }, companyData)
}
