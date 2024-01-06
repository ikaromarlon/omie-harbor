const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs')
const config = require('../../config')

module.exports = () => {
  const SQS = new SQSClient()
  return {
    sendCompanyToIngestionQueue: async (companyId) => {
      const command = new SendMessageCommand({
        QueueUrl: config.SQS.ingestionQueueUrl,
        MessageGroupId: 'ingestion',
        MessageBody: JSON.stringify({ companyId })
      })
      const result = await SQS.send(command)
      return result
    },
    sendCompanyToDataExportQueue: async (companyId) => {
      const command = new SendMessageCommand({
        QueueUrl: config.SQS.dataExportQueueUrl,
        MessageGroupId: 'data-export',
        MessageBody: JSON.stringify({ companyId })
      })
      const result = await SQS.send(command)
      return result
    }
  }
}
