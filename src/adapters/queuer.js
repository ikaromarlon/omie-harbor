const aws = require('aws-sdk')
const config = require('../config')

module.exports = () => {
  const sqs = new aws.SQS()
  const { ingestionQueueUrl, dataExportQueueUrl } = config.sqs
  return {
    sendCompanyToIngestionQueue: async ({ companyId, startDate, endDate }) => sqs.sendMessage({
      QueueUrl: ingestionQueueUrl,
      MessageGroupId: companyId,
      MessageBody: JSON.stringify({ companyId, startDate, endDate })
    }).promise(),
    receiveCompanyFromIngestionQueue: async () => sqs.receiveMessage({
      QueueUrl: ingestionQueueUrl,
      MaxNumberOfMessages: 1
    }).promise(),
    sendCompanyToDataExportQueue: async (companyId) => sqs.sendMessage({
      QueueUrl: dataExportQueueUrl,
      MessageGroupId: companyId,
      MessageBody: JSON.stringify({ companyId })
    }).promise(),
    receiveCompanyFromExportQueue: async () => sqs.receiveMessage({
      QueueUrl: dataExportQueueUrl,
      MaxNumberOfMessages: 1
    }).promise()
  }
}
