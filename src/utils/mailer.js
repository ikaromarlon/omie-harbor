const AWS = require('aws-sdk')
const config = require('../config')
const { stripTags } = require('./helpers')
const logger = require('./logger')

const mailer = () => {
  const SES = new AWS.SES({ region: config.SES.region })
  const Charset = config.app.charset

  const sendDataProcessingStatus = async ({ notificationAddress, entity, data }) => {
    const template = `
    <h3>FullBPO App - Data Processing Status: ${entity}</h3>
    <p>
      Status: <strong style="color: ${data.status === 'FAIL' ? 'red' : 'green'}">${data.status}</strong><br>
      Batch: <strong>${data.batch}</strong><br>
      Batch Size: <strong>${data.batchSize}</strong><br>
      Company: <strong>${data.companyId} - ${data.companyCnpj} - ${data.companyName}</strong><br>
      Message: <strong>${data.message}</strong><br>
      {{content}}
    </p>`

    let content = ''
    if (data.data) {
      const cols = Object.keys(data.data[0])

      content = `
      <table border="1" style="border-collapse: separate; border-spacing: 0;">
        <tr>
          ${cols.reduce((acc, col) => (`${acc}<th style="padding: 2px 5px">${col}</th>`), '')}
        </tr>
        ${data.data.reduce((accX, e) => (`${accX}
          <tr>
            ${cols.reduce((accY, col) => (`${accY}<td style="padding: 2px 5px">${e[col]}</td>`), '')}
          </tr>`)
        , '')}
      </table>`
    }

    const params = {
      Destination: {
        ToAddresses: [notificationAddress]
      },
      Message: {
        Body: {
          Html: {
            Charset,
            Data: template.replace('{{content}}', content)
          },
          Text: {
            Charset,
            Data: stripTags(template.replace('<br>', "\n")).replace('{{content}}', data.data ? JSON.stringify(data.data, null, 2) : '') // eslint-disable-line
          }
        },
        Subject: {
          Charset,
          Data: `FullBPO App - Data Processing Status: ${entity}`
        }
      },
      Source: config.services.mailer.defaultSender
    }

    const logTitle = 'Mailer'
    const logMessage = 'sendDataProcessingStatus'

    try {
      const sent = await (SES.sendEmail(params).promise())

      if (config.app.stage === 'dev') {
        logger.info({ title: logTitle, message: logMessage, data: { sesMessageId: sent.MessageId } })
      }
    } catch (error) {
      logger.error({ title: logTitle, message: logMessage, data: { ...error, message: error.message, stack: error.stack } })
    }
  }

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
    sendDataProcessingStatus,
    sendErrorNotification
  }
}

module.exports = mailer
