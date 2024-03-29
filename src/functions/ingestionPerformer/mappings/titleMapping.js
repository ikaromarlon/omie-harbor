const { brDateToISO, multiply } = require('../../../common/utils')

module.exports = ({
  companyId,
  omieTitle,
  omieTitleEntries,
  omieTitleDepartment,
  omieTitleCategory,
  omieDocumentTypes,
  customerId,
  projectId,
  departmentId,
  categoryId,
  contractId,
  order,
  billing
}) => {
  const departmentPercentage = omieTitleDepartment?.nDistrPercentual ?? 100
  const categoryPercentage = omieTitleCategory?.nPerc ?? 100
  const depPerc = departmentPercentage / 100
  const catPerc = categoryPercentage / 100

  const omieDocumentType = omieDocumentTypes.find(e => e.codigo === omieTitle.cabecTitulo.cTipo)

  const values = omieTitleEntries.reduce((acc, omieTitleEntry) => {
    acc.balanceDue -= omieTitleEntry.nValLanc
    acc.discounts += omieTitleEntry.nDesconto
    acc.fees += omieTitleEntry.nJuros
    acc.paymentFine += omieTitleEntry.nMulta
    return acc
  }, { balanceDue: omieTitle.cabecTitulo.nValorTitulo, discounts: 0, fees: 0, paymentFine: 0 })

  return {
    companyId,
    externalId: String(omieTitle.cabecTitulo.nCodTitulo),
    titleId: String(omieTitle.cabecTitulo.nCodTitRepet),
    titleNumber: omieTitle.cabecTitulo.cNumTitulo,
    documentNumber: omieTitle.cabecTitulo.cNumDocFiscal ?? null,
    customerId: customerId ?? null,
    projectId: projectId ?? null,
    categoryId: categoryId ?? null,
    departmentId: departmentId ?? null,
    departmentPercentage,
    categoryPercentage,
    contractId: contractId ?? null,
    orderId: order?.id ?? null,
    orderNumber: order?.orderNumber ?? null,
    billingId: billing?.id ?? null,
    origin: billing?.type ?? null,
    type: {
      code: omieDocumentType.codigo,
      description: omieDocumentType.descricao
    },
    installment: omieTitle.cabecTitulo.cNumParcela,
    registerDate: brDateToISO(omieTitle.cabecTitulo.dDtRegistro),
    issueDate: omieTitle.cabecTitulo.dDtEmissao ? brDateToISO(omieTitle.cabecTitulo.dDtEmissao) : null,
    dueDate: brDateToISO(omieTitle.cabecTitulo.dDtVenc),
    expectedPaymentDate: brDateToISO(omieTitle.cabecTitulo.dDtPrevisao),
    paymentDate: omieTitle.cabecTitulo.dDtPagamento ? brDateToISO(omieTitle.cabecTitulo.dDtPagamento) : null,
    grossValue: multiply(multiply(omieTitle.cabecTitulo.nValorTitulo, depPerc), catPerc),
    netValue: multiply(multiply(omieTitle.cabecTitulo.nValorTitulo - values.discounts - values.paymentFine - values.fees, depPerc), catPerc),
    discounts: multiply(multiply(values.discounts, depPerc), catPerc),
    balanceDue: multiply(multiply(values.balanceDue, depPerc), catPerc),
    paymentFine: multiply(multiply(values.paymentFine, depPerc), catPerc),
    fees: multiply(multiply(values.fees, depPerc), catPerc),
    taxAmount: multiply(multiply((omieTitle.cabecTitulo.nValorIR ?? 0) + (omieTitle.cabecTitulo.nValorPIS ?? 0) + (omieTitle.cabecTitulo.nValorCOFINS ?? 0) + (omieTitle.cabecTitulo.nValorCSLL ?? 0) + (omieTitle.cabecTitulo.nValorICMS ?? 0) + (omieTitle.cabecTitulo.nValorISS ?? 0), depPerc), catPerc),
    taxes: {
      ir: multiply(multiply(omieTitle.cabecTitulo.nValorIR, depPerc), catPerc),
      pis: multiply(multiply(omieTitle.cabecTitulo.nValorPIS, depPerc), catPerc),
      cofins: multiply(multiply(omieTitle.cabecTitulo.nValorCOFINS, depPerc), catPerc),
      csll: multiply(multiply(omieTitle.cabecTitulo.nValorCSLL, depPerc), catPerc),
      icms: multiply(multiply(omieTitle.cabecTitulo.nValorICMS, depPerc), catPerc),
      iss: multiply(multiply(omieTitle.cabecTitulo.nValorISS, depPerc), catPerc)
    },
    status: omieTitle.cabecTitulo.cStatus,
    paidOff: omieTitle.resumo.cLiquidado === 'S',
    titleNotes: omieTitle.cabecTitulo.observacao || null
  }
}
