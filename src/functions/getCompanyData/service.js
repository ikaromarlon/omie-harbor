const { NotFoundException, ForbiddenException } = require('../../common/errors')

module.exports = ({
  companiesRepository,
  s3
}) => async (payload) => {
  const { id: companyId } = payload

  const company = await companiesRepository.findById(companyId)

  if (!company) {
    throw new NotFoundException('Company not found')
  }

  if (!company.isActive) {
    throw new ForbiddenException('Company is not active')
  }

  return s3.getCompanyDataSignedUrl(companyId)
}
