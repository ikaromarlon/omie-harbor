const aws = require('aws-sdk')
const config = require('../config')

module.exports = () => {
  const SQS = new aws.SQS()
  const { ingestionQueueUrl, dataExportQueueUrl } = config.SQS
  return {
    sendCompanyToIngestionQueue: async (companyId) => SQS.sendMessage({
      QueueUrl: ingestionQueueUrl,
      MessageGroupId: companyId,
      MessageBody: JSON.stringify({ companyId })
    }).promise(),
    sendCompanyToDataExportQueue: async (companyId) => SQS.sendMessage({
      QueueUrl: dataExportQueueUrl,
      MessageGroupId: companyId,
      MessageBody: JSON.stringify({ companyId })
    }).promise()
  }
}
