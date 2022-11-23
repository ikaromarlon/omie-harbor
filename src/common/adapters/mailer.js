const AWS = require('aws-sdk')
const config = require('../../config')
const { stripTags } = require('../helpers')
const logger = require('./logger')

const mailer = () => {
  const SES = new AWS.SES({ region: config.SES.region })
  const Charset = config.app.charset

  const sendErrorNotification = async (data) => {
    const template = `
    <h3>FullBPO App - Something went wrong :(</h3>
    <p>
      Message: <strong>${data.message}</strong><br>
      Error Type: <strong>${data.name ?? data.constructor.name}</strong><br>
      ${data?.data ? `Detail 1: <strong>${data.data.message}</strong><br>` : ''}
      ${data?.data?.response?.data?.faultstring ? `Detail 2: <strong>${data?.data?.response?.data?.faultstring}</strong><br>` : ''}
      <br>
      <code style="display:block; padding: 10px; background-color: black; color: white !important;">
        {{content}}
      </code>
    </p>`

    const params = {
      Destination: {
        ToAddresses: config.services.mailer.errorNotificationRecipientAddress.split(',').map(e => e.trim()),
        CcAddresses: config.services.mailer.errorNotificationRecipientAddressCopy.split(',').map(e => e.trim())
      },
      Message: {
        Body: {
          Html: {
            Charset,
            Data: template.replace('{{content}}', JSON.stringify(data, null, '&nbsp;').split("\n").join('<br>')) // eslint-disable-line
          },
          Text: {
            Charset,
            Data: stripTags(template.replace('<br>', "\n")).replace('{{content}}', JSON.stringify(data, null, 2)) // eslint-disable-line
          }
        },
        Subject: {
          Charset,
          Data: 'FullBPO App - Something went wrong :('
        }
      },
      Source: config.services.mailer.defaultSender
    }

    const logTitle = 'Mailer'
    const logMessage = 'sendErrorNotification'

    try {
      const sent = await (SES.sendEmail(params).promise())

      if (config.app.stage === 'dev') {
        logger.info({ title: logTitle, message: logMessage, data: { sesMessageId: sent.MessageId } })
      }
    } catch (error) {
      logger.error({ title: logTitle, message: logMessage, data: { ...error, message: error.message, stack: error.stack } })
    }
  }

  return {
    sendErrorNotification
  }
}

module.exports = mailer
