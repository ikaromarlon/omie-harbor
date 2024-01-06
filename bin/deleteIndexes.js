const mongodb = require('../src/repositories/utils/mongodb')

module.exports = async ({ config }) => {
  try {
    console.log('Deleting MongoDB Indexes:')
    console.log(config.bin.layout.dashRuler)
    const db = await mongodb.connect(config.db.mongodb.uri, config.db.mongodb.dbName)

    const collections = await db.collections()
    for (const collection of collections) {
      console.log(`${collection.collectionName}...`)
      await collection.dropIndexes()
      console.log('done!\n')
    }
  } finally {
    await mongodb.disconnect()
  }
}
