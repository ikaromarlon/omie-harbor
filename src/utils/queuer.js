const aws = require('aws-sdk')
const config = require('../config')

module.exports = () => {
  const sqs = new aws.SQS()
  const { ingestionQueueUrl, dataExportQueueUrl } = config.sqs
  return {
    sendCompanyToIngestionQueue: async (companyId) => sqs.sendMessage({
      QueueUrl: ingestionQueueUrl,
      MessageGroupId: companyId,
      MessageBody: JSON.stringify({ companyId })
    }).promise(),
    sendCompanyToDataExportQueue: async (companyId) => sqs.sendMessage({
      QueueUrl: dataExportQueueUrl,
      MessageGroupId: companyId,
      MessageBody: JSON.stringify({ companyId })
    }).promise()
  }
}
