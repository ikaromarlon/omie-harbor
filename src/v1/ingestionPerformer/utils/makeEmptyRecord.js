const { emptyProperties } = require('../../../common/helpers')

const makeEmptyRecord = async (id, { companyId, provider, isActive, ...data }) => {
  const emptyRecord = {
    _id: id,
    companyId,
    provider,
    ...emptyProperties(data, true)
  }
  if (isActive !== undefined) emptyRecord.isActive = true
  return emptyRecord
}

module.exports = makeEmptyRecord
