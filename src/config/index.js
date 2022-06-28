const { name, version } = require('../../package.json')
const { env } = process

module.exports = Object.freeze({
  app: {
    name: env.SERVICE || name,
    stage: env.STAGE || 'dev',
    version,
    user: 'SYSTEM',
    charset: 'UTF-8',
    region: env.REGION
  },
  mongodb: {
    uri: env.MONGODB_URI,
    dbName: env.MONGODB_DB_NAME
  },
  SQS: {
    ingestionQueueUrl: env.SQS_INGESTION_QUEUE_URL,
    dataExportQueueUrl: env.SQS_DATA_EXPORT_QUEUE_URL
  },
  S3: {
    detaExport: {
      bucketName: env.S3_DATA_EXPORT_BUCKET_NAME
    }
  },
  SES: {
    region: env.SES_REGION
  },
  services: {
    omie: {
      providerName: 'Omie',
      ingestionPeriod: 2, /** days back */
      apiBaseUrl: 'https://app.omie.com.br/api/v1',
      maxRequestPerPeriod: 240,
      requestPeriodSeconds: 60
    },
    mailer: {
      defaultSender: `no-reply@${env.APP_DOMAIN}`,
      errorNotificationRecipientAddres: env.ERROR_NOTIFICATION_RECIPIENT_ADDRESS || null
    }
  },
  flags: {
    logEachOmieError: env.FLAG_LOG_EACH_OMIE_ERROR === 'true',
    updateEmptyRecords: env.FLAG_UPDATE_EMPTY_RECORDS === 'true'
  }
})
