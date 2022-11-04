const { InternalServerError } = require('../../../common/errors')

module.exports = ({
  repositories
}) => {
  const deleteOrder = async (companyId, data) => {
    const order = await repositories.orders.findOne({
      companyId,
      externalId: String(data.idOrdemServico)
    })

    const ordersResult = await repositories.orders.deleteMany({
      companyId,
      _id: order._id
    })

    const accountsReceivableResult = await repositories.accountsReceivable.deleteMany({
      companyId,
      orderId: order._id
    })

    const financialMovementsResult = await repositories.financialMovements.deleteMany({
      companyId,
      orderId: order._id
    })

    return {
      order: ordersResult,
      accountsReceivable: accountsReceivableResult,
      financialMovements: financialMovementsResult
    }
  }

  const deleteContract = async (companyId, data) => {
    const contract = await repositories.contracts.findOne({
      companyId,
      externalId: String(data.idOrdemServico)
    })

    const contractsResult = await repositories.contracts.deleteMany({
      companyId,
      _id: contract._id
    })

    const accountsReceivableResult = await repositories.accountsReceivable.deleteMany({
      companyId,
      contractId: contract._id
    })

    const financialMovementsResult = await repositories.financialMovements.deleteMany({
      companyId,
      contractId: contract._id
    })

    return {
      contract: contractsResult,
      accountsReceivable: accountsReceivableResult,
      financialMovements: financialMovementsResult
    }
  }

  const deleteTitle = async (companyId, data) => {
    const accountsPayableResult = await repositories.accountsPayable.deleteMany({
      companyId,
      externalId: String(data.codLancamento)
    })

    const accountsReceivableResult = await repositories.accountsReceivable.deleteMany({
      companyId,
      externalId: String(data.codLancamento)
    })

    const financialMovementsResult = await repositories.financialMovements.deleteMany({
      companyId,
      externalId: String(data.codLancamento)
    })

    return {
      accountsPayable: accountsPayableResult,
      accountsReceivable: accountsReceivableResult,
      financialMovements: financialMovementsResult
    }
  }

  const handler = async ({ payload }) => {
    const { appKey, topic, event } = payload

    const company = await repositories.companies.findOne({ 'credentials.appKey': appKey })

    if (!company) {
      throw new InternalServerError(`Company related to appKey '${appKey}' not found`)
    }

    const eventFlow = {
      'OrdemServico.Excluida': deleteOrder,
      'VendaProduto.Excluida': deleteOrder,
      'ContratoServico.Excluido': deleteContract,
      'Financas.ContaCorrente.Lancamento.Excluido': deleteTitle,
      'Financas.ContaCorrente.Transferencia.Excluido': deleteTitle,
      'Financas.ContaPagar.Excluido': deleteTitle,
      'Financas.ContaReceber.Excluido': deleteTitle
    }

    const result = await eventFlow[topic](company._id, event)

    return result
  }

  return handler
}
