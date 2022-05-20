const aws = require('aws-sdk')
const config = require('../config')

module.exports = () => {
  const sqs = new aws.SQS()
  const { dataExportQueueUrl } = config.sqs
  return {
    sendCompanyToDataExportQueue: async (companyId) => sqs.sendMessage({
      QueueUrl: dataExportQueueUrl,
      MessageGroupId: companyId,
      MessageBody: JSON.stringify({ companyId })
    }).promise()
  }
}
