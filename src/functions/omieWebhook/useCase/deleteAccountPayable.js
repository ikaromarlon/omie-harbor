const deleteAccountPayable = async (
  companyId,
  data,
  repositories
) => {
  const accountsPayable = await repositories.accountsPayable.find({
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
      acc.add(e._id)
      return acc
    }, new Set())]

    result.deleted.accountsPayable = await repositories.accountsPayable.deleteMany({
      companyId,
      _id: titleIds
    })

    result.deleted.financialMovements = await repositories.financialMovements.deleteMany({
      companyId,
      accountPayableId: titleIds
    })
  }

  return result
}

module.exports = deleteAccountPayable
