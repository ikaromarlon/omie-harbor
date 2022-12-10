const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
const config = require('../../config')
const ExternalServerError = require('../errors/ExternalServerError')
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

  const sendDataProcessingStatus = async ({ notificationAddress, entity, data }) => {
    const template = `
    <h3>Omie Importer - Data Processing Status: ${entity}</h3>
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
          Data: `Omie Importer - Data Processing Status: ${entity}`
        }
      },
      Source: defaultSender
    }

    try {
      const command = new SendEmailCommand(params)
      const result = await SES.send(command)
      return result
    } catch (error) {
      throw new ExternalServerError(error.message, error)
    }
  }

  return {
    sendErrorNotification,
    sendDataProcessingStatus
  }
}

module.exports = mailer
