const { makeDocument, parseDocument, parseDocuments, parseFilters } = require('./utils')

module.exports = (name, MongodbHelper, config, props = {}) => ({
  name,
  ...props,
  findOne: async (filters, options = {}) => {
    const collection = await MongodbHelper.collection(name, config)
    const parsedFilters = parseFilters(filters)
    const result = await collection.findOne(parsedFilters, options)
    return parseDocument(result)
  },
  findMany: async (filters = {}, options = {}) => {
    const collection = await MongodbHelper.collection(name, config)
    const parsedFilters = parseFilters(filters)
    const result = await collection.find(parsedFilters, options)
    return parseDocuments(result)
  },
  insertOne: async (data, options = {}) => {
    const collection = await MongodbHelper.collection(name, config)
    const doc = makeDocument(data)
    const result = await collection.insertOne(doc, options)
    return parseDocument({ _id: result.insertedId, ...doc })
  },
  updateOne: async (data, filters = {}, options = {}) => {
    const collection = await MongodbHelper.collection(name, config)
    const parsedFilters = parseFilters(filters)
    const doc = makeDocument(data, true)
    const result = await collection.findOneAndUpdate(
      parsedFilters,
      { $set: doc },
      { returnDocument: 'after', ...options }
    )
    return parseDocument(result.value)
  },
  deleteOne: async (filters = {}, options = {}) => {
    const collection = await MongodbHelper.collection(name, config)
    const parsedFilters = parseFilters(filters)
    const result = await collection.deleteOne(parsedFilters, options)
    return Boolean(result.deletedCount)
  },
  deleteMany: async (filters = {}, options = {}) => {
    const collection = await MongodbHelper.collection(name, config)
    const parsedFilters = parseFilters(filters)
    const result = await collection.deleteMany(parsedFilters, options)
    return result.deletedCount
  },
  count: async (filters = {}, options = {}) => {
    const collection = await MongodbHelper.collection(name, config)
    const parsedFilters = parseFilters(filters)
    return collection.count(parsedFilters, options)
  },
  aggregate: async (pipeline, options = {}) => {
    const collection = await MongodbHelper.collection(name, config)
    const result = await collection.aggregate(pipeline, options)
    return parseDocuments(result)
  },
  createOrUpdateOne: async (data, filters = {}, options = {}) => {
    const collection = await MongodbHelper.collection(name, config)
    const { _id, createdAt, updatedAt, ...other } = makeDocument(data)
    const parsedFilters = Object.keys(filters).length ? parseFilters(filters) : { _id }
    const result = await collection.findOneAndUpdate(
      parsedFilters,
      {
        $setOnInsert: { _id, createdAt },
        $set: { ...other, updatedAt }
      },
      { returnDocument: 'after', ...options, upsert: true }
    )
    return result
  },
  createOrUpdateMany: async (batch, buildFilter) => {
    const collection = await MongodbHelper.collection(name, config)
    const response = {
      written: 0,
      created: 0,
      updated: 0
    }
    if (buildFilter.length && batch.length) {
      const batchWrite = batch.map(data => {
        const doc = makeDocument(data)
        const filters = buildFilter.reduce((acc, f) => {
          if (f === 'id') acc._id = doc._id
          acc[f] = doc[f]
          return acc
        }, {})
        const parsedFilters = parseFilters(filters)
        const { _id, createdAt, updatedAt, ...other } = doc
        return {
          updateOne: {
            filter: parsedFilters,
            update: {
              $setOnInsert: { _id, createdAt },
              $set: { ...other, updatedAt }
            },
            upsert: true
          }
        }
      })
      const result = await collection.bulkWrite(batchWrite, { ordered: true })
      response.written = result.result.nInserted + result.result.nUpserted + result.result.nModified
      response.created = result.result.nInserted + result.result.nUpserted
      response.updated = result.result.nModified
    }
    return response
  },
  deleteOldAndCreateNew: async (batch, buildFilter) => {
    const collection = await MongodbHelper.collection(name, config)
    const response = {
      deleted: 0,
      created: 0
    }
    if (buildFilter.length && batch.length) {
      const recordsToDelete = new Set()
      const bulkDelete = []
      batch.forEach((data) => {
        recordsToDelete.add(JSON.stringify(buildFilter.reduce((acc, f) => ({ ...acc, [f]: data[f] }), {})))
      })
      recordsToDelete.forEach(data => bulkDelete.push({ deleteMany: { filter: JSON.parse(data) } }))

      const bulkInsert = []

      batch.forEach(data => {
        const doc = makeDocument(data)
        bulkInsert.push({
          insertOne: {
            document: doc
          }
        })
      })

      const result = await collection.bulkWrite([...bulkDelete, ...bulkInsert], { ordered: true })
      response.deleted = result.result.nRemoved
      response.created = result.result.nInserted
    }
    return response
  }
})