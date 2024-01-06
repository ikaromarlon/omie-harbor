const config = require('../../config')
const { NotFoundException } = require('../../common/errors')
const { OMIE_WEBHOOK_EVENTS } = require('./enums')
const deleteOrder = require('./useCases/deleteOrder')
const deleteContract = require('./useCases/deleteContract')
const deleteAccountPayable = require('./useCases/deleteAccountPayable')
const deleteAccountReceivable = require('./useCases/deleteAccountReceivable')
const deleteFinancialMovement = require('./useCases/deleteFinancialMovement')

module.exports = ({
  repositories,
  logger,
  queuer
}) => {
  const handler = async ({ payload }) => {
    const actions = {
      [OMIE_WEBHOOK_EVENTS.SERVICE_ORDER.DELETED]: deleteOrder,
      [OMIE_WEBHOOK_EVENTS.SALES_ORDER.DELETED]: deleteOrder,
      [OMIE_WEBHOOK_EVENTS.CONTRACT.DELETED]: deleteContract,
      [OMIE_WEBHOOK_EVENTS.ENTRY_INVOICE.DELETED]: deleteAccountPayable,
      [OMIE_WEBHOOK_EVENTS.ACCOUNT_PAYABLE.DELETED]: deleteAccountPayable,
      [OMIE_WEBHOOK_EVENTS.ACCOUNT_RECEIVABLE.DELETED]: deleteAccountReceivable,
      [OMIE_WEBHOOK_EVENTS.CHECKING_ACCOUNT_ENTRY.DELETED]: deleteFinancialMovement,
      [OMIE_WEBHOOK_EVENTS.CHECKING_ACCOUNT_TRANSFER.DELETED]: deleteFinancialMovement
    }

    const { ping, appKey, topic, event } = payload

    if (ping) {
      return {
        ping,
        pong: config.app.name
      }
    }

    const company = await repositories.companies.findOne({ 'credentials.appKey': appKey })

    if (!company) {
      throw new NotFoundException(`Company related to appKey '${appKey}' not found`)
    }

    const action = actions[topic]

    let result = {
      message: `Unknown action: ${topic}`
    }

    let hasAffected = false

    if (action) {
      result = await action(company._id, event, repositories)

      hasAffected = Object.values(result.deleted).some(e => e)
    }

    logger.info({
      title: 'webhook',
      message: `Action for company ${company._id} - ${company.name}: ${topic}`,
      data: {
        result,
        payload
      }
    })

    if (hasAffected) {
      await queuer.sendCompanyToDataExportQueue(company._id)

      logger.info({
        title: 'webhook',
        message: `Company ${company._id} - ${company.name} sent to dataExport process`
      })
    }

    return result
  }

  return handler
}