const { emptyProperties } = require('../../../common/helpers')

const makeEmptyRecord = (id, { companyId, isActive, ...data }) => {
  const emptyRecord = {
    _id: id,
    companyId,
    ...emptyProperties(data, true)
  }
  if (isActive !== undefined) emptyRecord.isActive = true
  return emptyRecord
}

module.exports = makeEmptyRecord
