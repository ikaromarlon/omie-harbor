const { nullProperties } = require('../../../common/utils')

const makeEmptyRecord = (id, { companyId, isActive, ...data }) => {
  const emptyRecord = {
    id,
    companyId,
    ...nullProperties(data, true)
  }
  if (isActive !== undefined) emptyRecord.isActive = true
  return emptyRecord
}

module.exports = makeEmptyRecord
