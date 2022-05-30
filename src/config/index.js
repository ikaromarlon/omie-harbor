const { name, version } = require('../../package.json')
const { env } = process

const stage = env.STAGE || 'dev'

module.exports = Object.seal({
  app: {
    name: env.SERVICE || name,
    stage,
    version,
    user: 'SYSTEM'
  },
  mongodb: {
    dbName: `full-bpo-${stage}`,
    uri: `mongodb+srv://${env.MONGODB_CREDENTIALS}@full-bpo-${stage}.vkvc7.mongodb.net/full-bpo-${stage}?retryWrites=true&w=majority`
  },
  sqs: {
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
