const AWS = require('aws-sdk')
const config = require('../config')
const { stripTags } = require('./helpers')

const mailer = () => {
  const SES = new AWS.SES({ region: config.SES.region })
  const Charset = config.app.charset

  const sendErrorNotification = async (data) => {
    const template = `
    <h3>FullBPO App - Something went wrong :(</h3>
    <p>
      Message: <strong>${data.message}</strong><br>
      Error Type: <strong>${data.name ?? data.constructor.name}</strong><br>
      ${data?.data ? `Detail: <strong>${data.data.message}</strong><br>` : ''}
      <br>
      <code style="display:block; padding: 10px; background-color: black; color: white !important;">
        {{content}}
      </code>
    </p>`

    const params = {
      Destination: {
        ToAddresses: [config.services.mailer.errorNotificationRecipientAddres]
      },
      Message: {
        Body: {
          Html: {
            Charset,
            Data: template.replace('{{content}}', JSON.stringify(data, null, '&nbsp;').split('\n').join('<br>'))
          },
          Text: {
            Charset,
            Data: stripTags(template).replace('{{content}}', JSON.stringify(data, null, 2))
          }
        },
        Subject: {
          Charset,
          Data: 'FullBPO App - Something went wrong :('
        }
      },
      Source: config.services.mailer.defaultSender
    }

    try {
      const sent = await (SES.sendEmail(params).promise())
      console.log(sent.MessageId)
    } catch (error) {
      console.error(error, error.stack)
    }
  }

  return {
    sendErrorNotification
  }
}

module.exports = mailer
