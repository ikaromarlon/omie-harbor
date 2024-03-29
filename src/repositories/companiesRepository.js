const config = require('../config')
const MongodbHelper = require('../infra/db/mongodb')

module.exports = () => {
  MongodbHelper.setup(config.db.mongodb)

  const repository = MongodbHelper.repository('companies')

  return {
    create: async (data) => {
      return repository.insertOne(data)
    },

    find: async ({
      id,
      isActive
    } = {}) => {
      const filter = {}
      if (id) filter.id = id
      if (isActive !== undefined) filter.isActive = isActive
      return repository.findMany(filter)
    },

    findById: async id => {
      if (!id) return null
      return repository.findOne({ id })
    },

    findByAppKey: async (appKey) => {
      if (!appKey) return null
      return repository.findOne({ 'credentials.appKey': appKey })
    },

    findByCredentials: async (appKey, appSecret) => {
      if (!appKey || !appSecret) return null
      return repository.findOne({ credentials: { appKey, appSecret } })
    },

    update: async ({ id, ...data }) => {
      return repository.updateOne(data, { id })
    }
  }
}
