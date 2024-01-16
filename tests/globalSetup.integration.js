const globalSetup = require('./globalSetup')
const config = require('../src/config')
const MongodbHelper = require('../src/infra/db/mongodb')

module.exports = async () => {
  await globalSetup()

  const db = await MongodbHelper.connect(config.db.mongodb)
  db.dropDatabase()
}
