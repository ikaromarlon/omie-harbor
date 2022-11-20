const AWS = require('aws-sdk')
const config = require('../../config')
const { ExternalServerError } = require('../errors')

module.exports = () => {
  const source = config.app.name

  const eventBridge = new AWS.EventBridge()

  const parseResult = ({ result, target }) => {
    if (result.FailedEntryCount === result.Entries.length) {
      throw new ExternalServerError(`Error triggering ${target} from source ${source}`, result)
    }

    if (result.FailedEntryCount > 0) {
      return {
        success: false,
        result: { ...result }
      }
    }

    return {
      success: true,
      eventIds: result.Entries.map(e => e.EventId)
    }
  }

  return {
    triggerBfbDataExport: async (data) => {
      const target = `${config.app.name}.dataExport`
      const Entries = [
        {
          Source: source,
          DetailType: target,
          Detail: JSON.stringify(data)
        }
      ]

      const result = await eventBridge.putEvents({ Entries }).promise()

      return parseResult({ result, target })
    }
  }
}
