const { brDateToISO, multiply } = require('../../../common/utils')

module.exports = ({
  companyId,
  omieFinancialMovement,
  omieFinancialMovementDepartment,
  omieFinancialMovementCategory,
  omieEntryOrigins,
  omieDocumentTypes,
  customerId,
  projectId,
  departmentId,
  categoryId,
  checkingAccountId,
  contractId,
  order,
  billing,
  accountPayableId,
  accountReceivableId
}) => {
  const departmentPercentage = omieFinancialMovementDepartment?.nDistrPercentual ?? 100
  const categoryPercentage = omieFinancialMovementCategory?.nDistrPercentual ?? 100
  const depPerc = departmentPercentage / 100
  const catPerc = categoryPercentage / 100

  const omieEntryOrigin = omieEntryOrigins.find(e => e.codigo === omieFinancialMovement.detalhes.cOrigem)
  const omieDocumentType = omieDocumentTypes.find(e => e.codigo === omieFinancialMovement.detalhes.cTipo)

  let externalId = String(omieFinancialMovement.detalhes.nCodMovCC || omieFinancialMovement.detalhes.nCodTitulo)
  if (omieFinancialMovement.detalhes.nCodMovCC && omieFinancialMovement.detalhes.nCodTitulo) {
    externalId = String(omieFinancialMovement.detalhes.nCodTitulo)
  }

  return {
    companyId,
    externalId,
    movementId: String(omieFinancialMovement.detalhes.nCodMovCCRepet || omieFinancialMovement.detalhes.nCodTitRepet),
    titleNumber: omieFinancialMovement.detalhes.cNumTitulo,
    documentNumber: omieFinancialMovement.detalhes.cNumDocFiscal ?? null,
    customerId: customerId ?? null,
    projectId: projectId ?? null,
    categoryId: categoryId ?? null,
    departmentId: departmentId ?? null,
    checkingAccountId: checkingAccountId ?? null,
    departmentPercentage,
    categoryPercentage,
    contractId: contractId ?? null,
    orderId: order?.id ?? null,
    orderNumber: order?.orderNumber ?? null,
    billingId: billing?.id ?? null,
    origin: billing?.type ?? null,
    accountPayableId: accountPayableId ?? null,
    accountReceivableId: accountReceivableId ?? null,
    type: {
      code: omieDocumentType.codigo,
      description: omieDocumentType.descricao
    },
    entryOrigin: {
      code: omieEntryOrigin.codigo,
      description: omieEntryOrigin.descricao
    },
    group: omieFinancialMovement.detalhes.cGrupo,
    installment: omieFinancialMovement.detalhes.cNumParcela ?? null,
    registerDate: brDateToISO(omieFinancialMovement.detalhes.dDtRegistro ?? omieFinancialMovement.detalhes.dDtInc),
    issueDate: omieFinancialMovement.detalhes.dDtEmissao ? brDateToISO(omieFinancialMovement.detalhes.dDtEmissao) : null,
    dueDate: omieFinancialMovement.detalhes.dDtVenc ? brDateToISO(omieFinancialMovement.detalhes.dDtVenc) : null,
    expectedPaymentDate: omieFinancialMovement.detalhes.dDtPrevisao ? brDateToISO(omieFinancialMovement.detalhes.dDtPrevisao) : null,
    paymentDate: omieFinancialMovement.detalhes.dDtPagamento ? brDateToISO(omieFinancialMovement.detalhes.dDtPagamento) : null,
    reconciliationDate: omieFinancialMovement.detalhes.dDtConcilia ? brDateToISO(omieFinancialMovement.detalhes.dDtConcilia) : null,
    value: multiply(multiply(omieFinancialMovement.detalhes.nValorTitulo, depPerc), catPerc),
    paidValue: multiply(multiply(omieFinancialMovement.resumo.nValPago, depPerc), catPerc),
    status: omieFinancialMovement.detalhes.cStatus,
    titleNotes: omieFinancialMovement.detalhes.observacao || null
  }
}
