module.exports = Object.freeze({
  app: {
    name: process.env.APP_NAME,
    service: process.env.SERVICE,
    stage: process.env.STAGE,
    version: process.env.VERSION,
    region: process.env.REGION
  },
  db: {
    mongodb: {
      uri: process.env.MONGODB_URI,
      dbName: `omie-harbor-${process.env.STAGE}`
    }
  },
  services: {
    omie: {
      apiBaseUrl: 'https://app.omie.com.br/api/v1',
      ingestionPeriod: 3, /** days back */
      requestPeriod: 60, /** in seconds */
      maxRequestPerPeriod: 200 /** in seconds */
    },
    SQS: {
      ingestionQueueUrl: process.env.SQS_INGESTION_QUEUE_URL,
      dataExportQueueUrl: process.env.SQS_DATA_EXPORT_QUEUE_URL
    },
    S3: {
      detaExportBucket: {
        name: process.env.S3_DATA_EXPORT_BUCKET_NAME
      }
    }
  }
})
