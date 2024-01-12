const { NotFoundException } = require('../../common/errors')

module.exports = ({
  companiesRepository
}) => async (payload) => {
  const { id: companyId } = payload

  if (companyId) {
    const company = await companiesRepository.findById(companyId)
    if (!company) {
      throw new NotFoundException('Company not found')
    }
    return company
  }

  const filter = {}
  if (payload.isActive !== undefined) {
    filter.isActive = payload.isActive
  }

  const companies = await companiesRepository.find(filter)

  return companies
}
