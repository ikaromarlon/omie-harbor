const MongodbHelper = require('../src/infra/db/mongodb')

module.exports = async () => {
  await MongodbHelper.disconnect()
}
