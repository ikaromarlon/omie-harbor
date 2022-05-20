module.exports = ({ providerName, helpers: { brDateToISO, multiply } }) => ({
  omieTitle,
  omieTitleEntry,
  omieTitleDepartment,
  omieTitleCategory,
  omieEntryOrigins,
  omieDocumentTypes,
  companyId,
  customerId,
  projectId,
  departmentId,
  categoryId,
  checkingAccountId,
  emptyRecordsIds,
  contractId,
  order,
  billing
}) => {
  const departmentPercentage = omieTitleDepartment?.nDistrPercentual ?? 100
  const categoryPercentage = omieTitleCategory?.nPerc ?? 100
  const depPerc = departmentPercentage / 100
  const catPerc = categoryPercentage / 100

  const omieEntryOrigin = omieEntryOrigins.find(e => e.codigo === omieTitle.cabecTitulo.cOrigem)
  const omieDocumentType = omieDocumentTypes.find(e => e.codigo === omieTitle.cabecTitulo.cTipo)

  return {
    externalId: String(omieTitle.cabecTitulo.nCodTitulo),
    titleId: String(omieTitle.cabecTitulo.nCodTitRepet),
    titleNumber: omieTitle.cabecTitulo.cNumTitulo,
    documentNumber: omieTitle.cabecTitulo.cNumDocFiscal ?? null,
    entryCode: String(omieTitleEntry.nCodLanc),
    provider: providerName,
    companyId,
    customerId: customerId ?? emptyRecordsIds.customer,
    projectId: projectId ?? emptyRecordsIds.project,
    categoryId: categoryId ?? emptyRecordsIds.category,
    departmentId: departmentId ?? emptyRecordsIds.department,
    checkingAccountId: checkingAccountId ?? emptyRecordsIds.checkingAccount,
    departmentPercentage,
    categoryPercentage,
    contractId: contractId ?? emptyRecordsIds.contract,
    orderId: order?._id ?? emptyRecordsIds.order,
    orderNumber: order?.orderNumber ?? null,
    billingId: billing?._id ?? emptyRecordsIds.billing,
    origin: billing?.type ?? null,
    type: {
      code: omieDocumentType.codigo,
      description: omieDocumentType.descricao
    },
    entryOrigin: {
      code: omieEntryOrigin.codigo,
      description: omieEntryOrigin.descricao
    },
    installment: omieTitle.cabecTitulo.cNumParcela,
    registerDate: brDateToISO(omieTitle.cabecTitulo.dDtRegistro),
    issueDate: omieTitle.cabecTitulo.dDtEmissao ? brDateToISO(omieTitle.cabecTitulo.dDtEmissao) : null,
    dueDate: brDateToISO(omieTitle.cabecTitulo.dDtVenc),
    expectedPaymentDate: brDateToISO(omieTitle.cabecTitulo.dDtPrevisao),
    paymentDate: omieTitle.cabecTitulo.dDtPagamento ? brDateToISO(omieTitle.cabecTitulo.dDtPagamento) : null,
    grossValue: multiply(multiply(omieTitleEntry.nValLanc, depPerc), catPerc),
    netValue: multiply(multiply(omieTitleEntry.nValLanc - omieTitleEntry.nDesconto - omieTitleEntry.nMulta - omieTitleEntry.nJuros, depPerc), catPerc),
    discounts: multiply(multiply(omieTitleEntry.nDesconto, depPerc), catPerc),
    paymentFine: multiply(multiply(omieTitleEntry.nMulta, depPerc), catPerc),
    fees: multiply(multiply(omieTitleEntry.nJuros, depPerc), catPerc),
    taxAmount: multiply(multiply(omieTitle.cabecTitulo.nValorIR + omieTitle.cabecTitulo.nValorPIS + omieTitle.cabecTitulo.nValorCOFINS + omieTitle.cabecTitulo.nValorCSLL + (omieTitle.cabecTitulo.nValorICMS ?? 0) + (omieTitle.cabecTitulo.nValorISS ?? 0), depPerc), catPerc),
    taxes: {
      ir: multiply(multiply(omieTitle.cabecTitulo.nValorIR, depPerc), catPerc),
      pis: multiply(multiply(omieTitle.cabecTitulo.nValorPIS, depPerc), catPerc),
      cofins: multiply(multiply(omieTitle.cabecTitulo.nValorCOFINS, depPerc), catPerc),
      csll: multiply(multiply(omieTitle.cabecTitulo.nValorCSLL, depPerc), catPerc),
      icms: multiply(multiply(omieTitle.cabecTitulo.nValorICMS ?? 0, depPerc), catPerc),
      iss: multiply(multiply(omieTitle.cabecTitulo.nValorISS ?? 0, depPerc), catPerc)
    },
    status: omieTitle.cabecTitulo.cStatus,
    paidOff: omieTitle.resumo.cLiquidado === 'S',
    titleNotes: omieTitle.cabecTitulo.observacao || null,
    entryNotes: omieTitleEntry.cObsLanc || null
  }
}
