const AWS = require('aws-sdk')
const config = require('../../config')
const { ExternalServerError } = require('../errors')

module.exports = (sourceSufix = 'unknown') => {
  const { app: { source } } = config

  const eventBridge = new AWS.EventBridge()

  const parseResult = ({ result, target }) => {
    if (result.FailedEntryCount === result.Entries.length) {
      throw new ExternalServerError(`Error triggering ${target} from source ${source}.${sourceSufix}`, result)
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
    triggerBfbDataExport: async (companyId) => {
      const target = `${source}.dataExport`
      const Entries = [
        {
          Source: source,
          DetailType: target,
          Detail: JSON.stringify({ companyId })
        }
      ]

      const result = await eventBridge.putEvents({ Entries }).promise()

      return parseResult({ result, target })
    }
  }
}
