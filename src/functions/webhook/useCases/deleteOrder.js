const deleteOrder = async (
  companyId,
  data,
  repositories
) => {
  const orders = await repositories.orders.findMany({
    companyId,
    externalId: String(data.idOrdemServico ?? data.idPedido)
  })

  const result = {
    deleted: {
      orders: 0,
      accountsReceivable: 0,
      financialMovements: 0
    }
  }

  if (orders.length) {
    const orderIds = [...orders.reduce((acc, e) => {
      acc.add(e.id)
      return acc
    }, new Set())]

    result.deleted.orders = await repositories.orders.deleteMany({
      companyId,
      id: orderIds
    })

    result.deleted.accountsReceivable = await repositories.accountsReceivable.deleteMany({
      companyId,
      orderId: orderIds
    })

    result.deleted.financialMovements = await repositories.financialMovements.deleteMany({
      companyId,
      orderId: orderIds
    })
  }

  return result
}

module.exports = deleteOrder
