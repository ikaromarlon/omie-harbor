const { NotFoundError } = require('../../../common/errors')

module.exports = ({
  omieService,
  companyMapping,
  companiesRepository
}) => async ({ userId, payload }) => {
  const credentials = {
    appKey: payload.appKey.trim(),
    appSecret: payload.appSecret.trim()
  }

  const company = await companiesRepository.findOne({ credentials })
  if (company) return company

  const omieCompany = await omieService.getCompany(credentials, true)

  if (!omieCompany) {
    throw new NotFoundError('Company not found in Omie service. Check the AppKey and AppSecret and try again.')
  }

  const omieCnae = await omieService.getCnae(credentials)

  const companyData = companyMapping({ omieCompany, omieCnae, credentials })

  companyData.statusAt = null
  companyData.statusBy = null
  companyData.createdBy = userId
  companyData.updatedBy = userId

  return companiesRepository.createOrUpdateOne({ credentials }, companyData)
}
