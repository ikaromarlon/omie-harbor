const config = require('../../config')
const { uuid } = require('../../common/helpers')

module.exports = ({
  name,
  db,
  properties = {},
  customOperations = () => ({})
}) => {
  const collection = db.collection(name)

  const parseFilter = (filter) => Object.entries(filter).reduce((acc, [k, v]) => {
    const key = k === 'id' ? '_id' : k
    acc[key] = v
    if (key.indexOf('$') !== 0) { /** does not contains a special mongodb operator */
      if (Array.isArray(v)) {
        acc[key] = v.length > 1 ? { $in: v } : v[0]
      }
    }
    return acc
  }, {})

  return {
    name,
    find: async (filter) => {
      const parsedFilter = parseFilter(filter)
      return collection.find(parsedFilter).toArray()
    },
    findOne: async (filter) => {
      const parsedFilter = parseFilter(filter)
      return collection.findOne(parsedFilter)
    },
    createOrUpdateOne: async (filter, { _id, createdAt, createdBy, updatedAt, updatedBy, ...data }) => {
      const id = uuid()
      const date = new Date()
      const result = await collection.findOneAndUpdate(
        filter ?? { _id: id },
        {
          $setOnInsert: {
            _id: _id ?? id,
            createdAt: createdAt ?? date,
            createdBy: createdBy ?? config.app.user
          },
          $set: {
            ...data,
            updatedAt: updatedAt ?? date,
            updatedBy: updatedBy ?? config.app.user
          }
        },
        { upsert: true, returnDocument: 'after' }
      )
      return result
    },
    createOrUpdateMany: async (fieldsToBuildFilter, batch) => {
      const response = {
        written: 0,
        created: 0,
        updated: 0
      }
      if (fieldsToBuildFilter.length && batch.length) {
        const date = new Date()
        const batchWrite = batch.map(({ _id, createdAt, createdBy, updatedAt, updatedBy, ...data }) => ({
          updateOne: {
            filter: fieldsToBuildFilter.reduce((acc, f) => ({ ...acc, [f]: ({ _id, createdAt, createdBy, updatedAt, updatedBy, ...data })[f] }), {}),
            update: {
              $setOnInsert: {
                _id: _id ?? uuid(),
                createdAt: createdAt ?? date,
                createdBy: createdBy ?? config.app.user
              },
              $set: {
                ...data,
                updatedAt: updatedAt ?? date,
                updatedBy: updatedBy ?? config.app.user
              }
            },
            upsert: true
          }
        }))
        const result = await collection.bulkWrite(batchWrite, { ordered: true })
        response.written = result.result.nInserted + result.result.nUpserted + result.result.nModified
        response.created = result.result.nInserted + result.result.nUpserted
        response.updated = result.result.nModified
      }
      return response
    },
    deleteOldAndCreateNew: async (fieldsToBuildFilter, batch) => {
      const response = {
        deleted: 0,
        created: 0
      }
      if (fieldsToBuildFilter.length && batch.length) {
        const recordsToDelete = new Set()
        const bulkDelete = []
        batch.forEach((data) => {
          recordsToDelete.add(JSON.stringify(fieldsToBuildFilter.reduce((acc, f) => ({ ...acc, [f]: data[f] }), {})))
        })
        recordsToDelete.forEach(data => bulkDelete.push({ deleteMany: { filter: JSON.parse(data) } }))

        const date = new Date()
        const bulkInsert = []
        batch.forEach(({ _id, createdAt, createdBy, updatedAt, updatedBy, ...data }) => bulkInsert.push({
          insertOne: {
            document: {
              _id: _id ?? uuid(),
              createdAt: createdAt ?? date,
              createdBy: createdBy ?? config.app.user,
              updatedAt: updatedAt ?? date,
              updatedBy: updatedBy ?? config.app.user,
              ...data
            }
          }
        }))

        const result = await collection.bulkWrite([...bulkDelete, ...bulkInsert], { ordered: true })
        response.deleted = result.result.nRemoved
        response.created = result.result.nInserted
      }
      return response
    },
    deleteMany: async (filter) => {
      const parsedFilter = parseFilter(filter)
      const result = await collection.deleteMany(parsedFilter)
      return result.deletedCount
    },
    ...customOperations(collection),
    ...properties
  }
}
