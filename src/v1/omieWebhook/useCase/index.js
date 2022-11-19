const { InternalServerError } = require('../../../common/errors')
const deleteOrder = require('./deleteOrder')
const deleteContract = require('./deleteContract')
const deleteAccountPayable = require('./deleteAccountPayable')
const deleteAccountReceivable = require('./deleteAccountReceivable')
const deleteFinancialMovement = require('./deleteFinancialMovement')

module.exports = ({
  repositories,
  logger
}) => {
  const handler = async (payload) => {
    const { appKey, topic, event } = payload

    const company = await repositories.companies.find({ 'credentials.appKey': appKey })

    if (!company) {
      throw new InternalServerError(`Company related to appKey '${appKey}' not found`)
    }

    const actions = {
      'OrdemServico.Excluida': deleteOrder,
      'VendaProduto.Excluida': deleteOrder,
      'ContratoServico.Excluido': deleteContract,
      'Financas.ContaPagar.Excluido': deleteAccountPayable,
      'Financas.ContaReceber.Excluido': deleteAccountReceivable,
      'Financas.ContaCorrente.Lancamento.Excluido': deleteFinancialMovement,
      'Financas.ContaCorrente.Transferencia.Excluido': deleteFinancialMovement
    }

    const result = await actions[topic](company._id, event, repositories)

    logger.info({
      title: 'omieWebhook',
      message: `Action for company ${company._id} - ${company.name}: ${topic}`,
      data: {
        result,
        event
      }
    })

    return result
  }

  return handler
}
