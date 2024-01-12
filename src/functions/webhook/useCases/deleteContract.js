const deleteContract = async (
  companyId,
  data,
  repositories
) => {
  const contracts = await repositories.contracts.findMany({
    companyId,
    externalId: String(data.nCodCtr)
  })

  const result = {
    deleted: {
      contracts: 0,
      accountsReceivable: 0,
      financialMovements: 0
    }
  }

  if (contracts.length) {
    const contractIds = [...contracts.reduce((acc, e) => {
      acc.add(e.id)
      return acc
    }, new Set())]

    result.deleted.contracts = await repositories.contracts.deleteMany({
      companyId,
      id: contractIds
    })

    result.deleted.accountsReceivable = await repositories.accountsReceivable.deleteMany({
      companyId,
      contractId: contractIds
    })

    result.deleted.financialMovements = await repositories.financialMovements.deleteMany({
      companyId,
      contractId: contractIds
    })
  }

  return result
}

module.exports = deleteContract
