const { name, version } = require('../../package.json')
const { env } = process

module.exports = Object.seal({
  app: {
    name: env.SERVICE || name,
    stage: env.STAGE || 'dev',
    version,
    user: 'SYSTEM'
  },
  mongodb: {
    uri: env.MONGODB_URI,
    dbName: env.MONGODB_DB_NAME
  },
  sqs: {
    ingestionQueueUrl: env.SQS_INGESTION_QUEUE_URL,
    dataExportQueueUrl: env.SQS_DATA_EXPORT_QUEUE_URL
  },
  s3: {
    detaExport: {
      bucketName: env.S3_DATA_EXPORT_BUCKET_NAME
    }
  },
  services: {
    omie: {
      providerName: 'Omie',
      ingestionPeriod: 3, /** days back */
      apiBaseUrl: 'https://app.omie.com.br/api/v1',
      waitSecondsBeforeNextPageRequest: Number.parseInt(env.WAIT_SECONDS_BEFORE_NEXT_OMIE_PAGE_REQUEST) ?? 0
    }
  },
  flags: {
    logEachOmieError: env.FLAGS_LOG_EACH_OMIE_ERROR === 'true',
    updateEmptyRecords: env.FLAGS_UPDATE_EMPTY_RECORDS === 'true'
  }
})
