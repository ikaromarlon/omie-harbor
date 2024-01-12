const { NotFoundException } = require('../../common/errors')

module.exports = ({
  companiesRepository
}) => async (payload) => {
  const { id, isActive } = payload

  let company = await companiesRepository.findById(id)

  if (!company) {
    throw new NotFoundException('Company not found')
  }

  if (isActive !== company.isActive) {
    company = await companiesRepository.update({
      id,
      isActive,
      statusAt: new Date().toISOString()
    })
  }

  return company
}
