const deleteFinancialMovement = async (
  companyId,
  data,
  repositories
) => {
  const result = {
    deleted: {
      financialMovements: 0
    }
  }

  result.deleted.financialMovements = await repositories.financialMovements.deleteMany({
    companyId,
    externalId: String(data.nCodLanc)
  })

  return result
}

module.exports = deleteFinancialMovement
