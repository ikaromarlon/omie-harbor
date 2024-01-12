const { MongoClient, ServerApiVersion } = require('mongodb')
const factory = require('./factory')

const state = {
  client: null,
  db: null
}

module.exports = class MongodbHelper {
  static async connect (config) {
    if (!state.client) {
      state.client = await MongoClient.connect(config.uri, {
        minPoolSize: config.options?.minPoolSize,
        maxPoolSize: config.options?.maxPoolSize,
        serverApi: ServerApiVersion.v1
      })
      state.db = state.client.db(config.dbName)
    }
  }

  static async collection (name, config) {
    await MongodbHelper.connect(config)
    return state.db.collection(name)
  }

  static repository (name, config, props = {}) {
    return factory(name, MongodbHelper, config, props)
  }

  static async ping () {
    if (!state.client) return false
    await state.client.db('admin').command({ ping: 1 })
    return true
  }

  static async disconnect () {
    await state.client?.close()
    state.client = null
    state.config = null
  }
}
