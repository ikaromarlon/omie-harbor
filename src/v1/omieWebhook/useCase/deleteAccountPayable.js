const deleteAccountPayable = async (
  companyId,
  data,
  repositories
) => {
  const accountsPayable = await repositories.accountsPayable.find({
    companyId,
    externalId: String(data.codigo_lancamento_omie)
  })

  if (accountsPayable.length) {
    const titleIds = [...accountsPayable.reduce((acc, e) => {
      acc.add(e._id)
      return acc
    }, new Set())]

    const accountsPayableResult = await repositories.accountsPayable.deleteMany({
      companyId,
      _id: titleIds
    })

    const financialMovementsResult = await repositories.financialMovements.deleteMany({
      companyId,
      accountPayableId: titleIds
    })

    return {
      accountsPayable: accountsPayableResult,
      financialMovements: financialMovementsResult
    }
  }
}

module.exports = deleteAccountPayable
