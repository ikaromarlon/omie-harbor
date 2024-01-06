const deleteAccountReceivable = async (
  companyId,
  data,
  repositories
) => {
  const accountsReceivable = await repositories.accountsReceivable.find({
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
      acc.add(e._id)
      return acc
    }, new Set())]

    result.deleted.accountsReceivable = await repositories.accountsReceivable.deleteMany({
      companyId,
      _id: titleIds
    })

    result.deleted.financialMovements = await repositories.financialMovements.deleteMany({
      companyId,
      accountReceivableId: titleIds
    })
  }

  return result
}

module.exports = deleteAccountReceivable
