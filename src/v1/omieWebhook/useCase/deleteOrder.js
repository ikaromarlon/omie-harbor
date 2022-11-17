const deleteOrder = async (
  companyId,
  data,
  repositories
) => {
  const orders = await repositories.orders.find({
    companyId,
    externalId: String(data.idOrdemServico ?? data.idPedido)
  })

  if (orders.length) {
    const orderIds = [...orders.reduce((acc, e) => {
      acc.add(e._id)
      return acc
    }, new Set())]

    const ordersResult = await repositories.orders.deleteMany({
      companyId,
      _id: orderIds
    })

    const accountsReceivableResult = await repositories.accountsReceivable.deleteMany({
      companyId,
      orderId: orderIds
    })

    const financialMovementsResult = await repositories.financialMovements.deleteMany({
      companyId,
      orderId: orderIds
    })

    return {
      order: ordersResult,
      accountsReceivable: accountsReceivableResult,
      financialMovements: financialMovementsResult
    }
  }
}

module.exports = deleteOrder
