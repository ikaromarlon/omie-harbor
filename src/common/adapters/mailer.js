const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
const config = require('../../config')
const { stripTags } = require('../helpers')
const logger = require('./logger')

const mailer = () => {
  const {
    app: {
      name,
      service,
      stage,
      charset: Charset
    },
    SES: {
      region
    },
    services: {
      mailer: {
        defaultSender,
        errorNotificationRecipientAddress,
        errorNotificationRecipientAddressCopy
      }
    }
  } = config

  const SES = new SESClient({ region })

  const sendErrorNotification = async (data) => {
    const func = ''
    const route = ''
    const template = `
    <h3>${name} App [${stage}] - Something went wrong :(</h3>
    <p>
      Service: <strong>${service}</strong><br>
      Stage: <strong>${stage}</strong><br>
      ${func ? `Function: <strong>${func}</strong><br>` : ''}
      ${route ? `Route: <strong>${route}</strong><br>` : ''}
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
        ToAddresses: errorNotificationRecipientAddress.split(',').map(e => e.trim())
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
          Data: `${name} App [${stage}] - Something went wrong :(`
        }
      },
      Source: defaultSender
    }

    if (errorNotificationRecipientAddressCopy) {
      params.Destination.CcAddresses = errorNotificationRecipientAddressCopy.split(',').map(e => e.trim())
    }

    try {
      const command = new SendEmailCommand(params)
      const result = await SES.send(command)
      return result
    } catch (error) {
      logger.error({ title: 'Mailer', message: 'sendErrorNotification', data: { ...error, message: error.message, stack: error.stack } })
    }
  }

  return {
    sendErrorNotification
  }
}

module.exports = mailer
