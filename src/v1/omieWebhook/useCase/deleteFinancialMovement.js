const deleteFinancialMovement = async (
  companyId,
  data,
  repositories
) => {
  const financialMovementsResult = await repositories.financialMovements.deleteMany({
    companyId,
    externalId: String(data.nCodLanc)
  })

  return {
    financialMovements: financialMovementsResult
  }
}

module.exports = deleteFinancialMovement
