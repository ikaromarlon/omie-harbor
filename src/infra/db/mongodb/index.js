const { MongoClient, ServerApiVersion } = require('mongodb')
const factory = require('./factory')

const state = {
  client: null,
  db: null,
  config: null
}

module.exports = class MongodbHelper {
  static setup (config) {
    if (!state.config && config) {
      state.config = config
    }
  }

  static async connect (config) {
    if (!state.client) {
      MongodbHelper.setup(config)
      state.client = await MongoClient.connect(config.uri, {
        minPoolSize: config.options?.minPoolSize,
        maxPoolSize: config.options?.maxPoolSize,
        serverApi: ServerApiVersion.v1
      })
      state.db = state.client.db(config.dbName)
    }
    return state.db
  }

  static async collection (name) {
    await MongodbHelper.connect(state.config)
    return state.db.collection(name)
  }

  static repository (name, props = {}) {
    return factory({
      name,
      props,
      MongodbHelper
    })
  }

  static async ping () {
    if (!state.client) return false
    await state.client.db('admin').command({ ping: 1 })
    return true
  }

  static async disconnect () {
    await state.client?.close()
    state.client = null
    state.db = null
    state.config = null
  }
}
