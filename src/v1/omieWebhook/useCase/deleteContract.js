const deleteContract = async (
  companyId,
  data,
  repositories
) => {
  const contracts = await repositories.contracts.find({
    companyId,
    externalId: String(data.nCodCtr)
  })

  if (contracts.length) {
    const contractIds = [...contracts.reduce((acc, e) => {
      acc.add(e._id)
      return acc
    }, new Set())]

    const contractsResult = await repositories.contracts.deleteMany({
      companyId,
      _id: contractIds
    })

    const accountsReceivableResult = await repositories.accountsReceivable.deleteMany({
      companyId,
      contractId: contractIds
    })

    const financialMovementsResult = await repositories.financialMovements.deleteMany({
      companyId,
      contractId: contractIds
    })

    return {
      contract: contractsResult,
      accountsReceivable: accountsReceivableResult,
      financialMovements: financialMovementsResult
    }
  }
}

module.exports = deleteContract
