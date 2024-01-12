const deleteAccountReceivable = async (
  companyId,
  data,
  repositories
) => {
  const accountsReceivable = await repositories.accountsReceivable.findMany({
    companyId,
    externalId: String(data.codigo_lancamento_omie)
  })

  const result = {
    deleted: {
      accountsReceivable: 0,
      financialMovements: 0
    }
  }

  if (accountsReceivable.length) {
    const titleIds = [...accountsReceivable.reduce((acc, e) => {
      acc.add(e.id)
      return acc
    }, new Set())]

    result.deleted.accountsReceivable = await repositories.accountsReceivable.deleteMany({
      companyId,
      id: titleIds
    })

    result.deleted.financialMovements = await repositories.financialMovements.deleteMany({
      companyId,
      accountReceivableId: titleIds
    })
  }

  return result
}

module.exports = deleteAccountReceivable
