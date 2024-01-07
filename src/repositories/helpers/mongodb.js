const { MongoClient } = require('mongodb')

let cachedClient
let cachedDb

module.exports = {
  connect: async (uri, dbName) => {
    if (cachedDb) {
      if (cachedDb.namespace !== dbName) cachedDb = cachedClient.db(dbName)
    } else {
      cachedClient = await MongoClient.connect(uri)
      cachedDb = cachedClient.db(dbName)
    }
    return cachedDb
  },
  disconnect: async () => {
    if (cachedClient) await cachedClient.close()
    cachedClient = null
    cachedDb = null
    return cachedDb
  }
}
