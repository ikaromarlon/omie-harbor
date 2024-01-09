module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: `omie-harbor-${process.env.STAGE}`,
    options: {
      minPoolSize: 0,
      maxPoolSize: 100
    }
  }
}
