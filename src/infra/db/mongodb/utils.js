const { ObjectId } = require('mongodb')
const cleanupUndefinedValues = require('../../../common/utils/cleanupUndefinedValues')

const makeId = () => new ObjectId()

const parseId = (id) => {
  if (!ObjectId.isValid(id)) return id
  const _id = new ObjectId(id)
  if (_id.toString() !== id) return id
  return _id
}

const makeDocument = (data, updateOnly = false) => {
  const doc = cleanupUndefinedValues(data)
  const date = new Date().toJSON()
  // update
  doc.updatedAt = date
  if (updateOnly) return doc
  // insert or upsert
  doc._id = makeId()
  doc.createdAt = date
  return doc
}

const parseDocument = (data) => {
  if (!data) return null
  const { _id, ...other } = data
  return ({ id: _id.toString(), ...other })
}

const parseDocuments = async data => (await data.toArray()).map(parseDocument)

const parseFilters = ({ _id, id, ...others } = {}) => ({
  ...(_id ?? id ? { _id: parseId(_id ?? id) } : {}),
  ...Object.entries(others).reduce((acc, [key, value]) => {
    /* ignore undefined values */
    if (typeof value === 'undefined') return acc
    /* set key-value */
    acc[key] = value
    /* keep mongodb special operators */
    if (key.indexOf('$') === 0) return acc
    /* deal with arrays */
    if (Array.isArray(value)) acc[key] = { $in: value }
    return acc
  }, {})
})

module.exports = {
  makeId,
  parseId,
  makeDocument,
  parseDocument,
  parseDocuments,
  parseFilters
}
