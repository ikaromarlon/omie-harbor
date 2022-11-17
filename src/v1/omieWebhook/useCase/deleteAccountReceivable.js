const deleteAccountReceivable = async (
  companyId,
  data,
  repositories
) => {
  const accountsReceivable = await repositories.accountsReceivable.find({
    companyId,
    externalId: String(data.codigo_lancamento_omie)
  })

  if (accountsReceivable.length) {
    const titleIds = [...accountsReceivable.reduce((acc, e) => {
      acc.add(e._id)
      return acc
    }, new Set())]

    const accountsReceivableResult = await repositories.accountsReceivable.deleteMany({
      companyId,
      _id: titleIds
    })

    const financialMovementsResult = await repositories.financialMovements.deleteMany({
      companyId,
      accountReceivableId: titleIds
    })

    return {
      accountsReceivable: accountsReceivableResult,
      financialMovements: financialMovementsResult
    }
  }
}

module.exports = deleteAccountReceivable
