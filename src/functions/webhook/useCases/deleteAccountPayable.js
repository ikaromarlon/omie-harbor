const deleteAccountPayable = async (
  companyId,
  data,
  repositories
) => {
  const accountsPayable = await repositories.accountsPayable.findMany({
    companyId,
    externalId: String(data.codigo_lancamento_omie)
  })

  const result = {
    deleted: {
      accountsPayable: 0,
      financialMovements: 0
    }
  }

  if (accountsPayable.length) {
    const titleIds = [...accountsPayable.reduce((acc, e) => {
      acc.add(e.id)
      return acc
    }, new Set())]

    result.deleted.accountsPayable = await repositories.accountsPayable.deleteMany({
      companyId,
      id: titleIds
    })

    result.deleted.financialMovements = await repositories.financialMovements.deleteMany({
      companyId,
      accountPayableId: titleIds
    })
  }

  return result
}

module.exports = deleteAccountPayable
