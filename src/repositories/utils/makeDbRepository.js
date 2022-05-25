const config = require('../../config')
const { uuid } = require('../../utils/helpers')

module.exports = (name, db, customOperations = () => ({})) => {
  const collection = db.collection(name)
  return {
    find: async (filter) => {
      const parsedFilter = Object.entries(filter).reduce((acc, [k, v]) => {
        acc[k] = v
        if (k.indexOf('$') !== 0) { // does not contains a special mongodb operator
          if (Array.isArray(v)) {
            acc[k] = v.length > 1 ? { $in: v } : v[0]
          }
        }
        return acc
      }, {})
      return collection.find(parsedFilter).toArray()
    },
    findOne: async (filter) => collection.findOne(filter),
    createOrUpdateOneRaw: async (filter, data) => {
      const result = await collection.findOneAndUpdate(
        filter,
        { $set: data },
        { upsert: true, returnDocument: 'after' }
      )
      return result.value
    },
    createOrUpdateOne: async (filter, data) => {
      const _id = uuid()
      const date = new Date()
      const result = await collection.findOneAndUpdate(
        filter ?? { _id },
        {
          $setOnInsert: {
            _id: data._id ?? _id,
            createdAt: date,
            createdBy: config.app.user
          },
          $set: {
            updatedAt: date,
            updatedBy: config.app.user,
            ...data
          }
        },
        { upsert: true, returnDocument: 'after' }
      )
      return result.value
    },
    createOrUpdateMany: async (fieldsToBuildFilter, batch) => {
      const response = {
        written: 0,
        created: 0,
        updated: 0
      }
      if (fieldsToBuildFilter.length && batch.length) {
        const date = new Date()
        const batchWrite = batch.map(data => ({
          updateOne: {
            filter: fieldsToBuildFilter.reduce((acc, f) => ({ ...acc, [f]: data[f] }), {}),
            update: {
              $setOnInsert: {
                _id: data._id ?? uuid(),
                createdAt: date,
                createdBy: config.app.user
              },
              $set: {
                updatedAt: date,
                updatedBy: config.app.user,
                ...data
              }
            },
            upsert: true
          }
        }))
        const result = await collection.bulkWrite(batchWrite)
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
        batch.forEach(data => bulkInsert.push({
          insertOne: {
            document: {
              _id: data._id ?? uuid(),
              createdAt: date,
              createdBy: config.app.user,
              updatedAt: date,
              updatedBy: config.app.user,
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
    ...customOperations(collection)
  }
}
