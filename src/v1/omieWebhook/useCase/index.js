const { InternalServerError } = require('../../../common/errors')
const { OMIE_WEBHOOK_EVENTS } = require('../../../common/enums')
const deleteOrder = require('./deleteOrder')
const deleteContract = require('./deleteContract')
const deleteAccountPayable = require('./deleteAccountPayable')
const deleteAccountReceivable = require('./deleteAccountReceivable')
const deleteFinancialMovement = require('./deleteFinancialMovement')

module.exports = ({
  repositories,
  logger,
  eventBridge
}) => {
  const handler = async ({ payload }) => {
    const { appKey, topic, event } = payload

    const company = await repositories.companies.findOne({ 'credentials.appKey': appKey })

    if (!company) {
      throw new InternalServerError(`Company related to appKey '${appKey}' not found`)
    }

    const actions = {
      [OMIE_WEBHOOK_EVENTS.SERVICE_ORDER.DELETED]: deleteOrder,
      [OMIE_WEBHOOK_EVENTS.SALES_ORDER.DELETED]: deleteOrder,
      [OMIE_WEBHOOK_EVENTS.CONTRACT.DELETED]: deleteContract,
      // [OMIE_WEBHOOK_EVENTS.ENTRY_INVOICE.DELETED]: deleteAccountPayable,
      [OMIE_WEBHOOK_EVENTS.ACCOUNT_PAYABLE.DELETED]: deleteAccountPayable,
      [OMIE_WEBHOOK_EVENTS.ACCOUNT_RECEIVABLE.DELETED]: deleteAccountReceivable,
      [OMIE_WEBHOOK_EVENTS.CHECKING_ACCOUNT_ENTRY.DELETED]: deleteFinancialMovement,
      [OMIE_WEBHOOK_EVENTS.CHECKING_ACCOUNT_TRANSFER.DELETED]: deleteFinancialMovement
    }

    const action = actions[topic]

    let result = null

    if (action) {
      result = await action(company._id, event, repositories)

      await eventBridge.triggerBfbDataExport(company._id)

      logger.info({
        title: 'omieWebhook',
        message: `Company ${company._id} - ${company.name} sent to dataExport process`
      })
    } else {
      result = {
        message: `Unknown action: ${topic}`
      }
    }

    logger.info({
      title: 'omieWebhook',
      message: `Action for company ${company._id} - ${company.name}: ${topic}`,
      data: {
        result,
        payload
      }
    })

    return result
  }

  return handler
}
