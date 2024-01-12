const { brDateToISO, multiply } = require('../../../common/utils')

module.exports = ({
  companyId,
  omieInvoice,
  omieInvoiceDepartment,
  omieInvoiceItem,
  customerId,
  projectId,
  departmentId,
  productServiceId,
  categoryId,
  emptyRecordsIds,
  contractId,
  order
}) => {
  const departmentPercentage = omieInvoiceDepartment?.nPercentualDistribuicao ?? 100
  const perc = departmentPercentage / 100

  return {
    companyId,
    externalId: String(omieInvoice.Cabecalho.nCodNF),
    documentKey: omieInvoice.Cabecalho.nChaveNFe || null,
    documentNumber: omieInvoice.Cabecalho.nNumeroNFSe || null,
    documentSerie: omieInvoice.Cabecalho.cSerieNFSe || null,
    orderId: order?.id ?? emptyRecordsIds.order,
    orderNumber: order?.orderNumber ?? null,
    customerId: customerId ?? emptyRecordsIds.customer,
    projectId: projectId ?? emptyRecordsIds.project,
    productServiceId: productServiceId ?? emptyRecordsIds.productService,
    categoryId: categoryId ?? emptyRecordsIds.category,
    departmentId: departmentId ?? emptyRecordsIds.department,
    departmentPercentage,
    cfop: null, /** only for products */
    municipalServiceCode: omieInvoiceItem.CodigoServico, /** Omie returns CodigoServico as municipalServiceCode in NFS-e API */
    contractId: contractId ?? emptyRecordsIds.contract,
    origin: order?.type ?? null,
    type: 'NFS-e',
    registerDate: brDateToISO(omieInvoice.Inclusao.cDataInclusao, omieInvoice.Inclusao.cHoraInclusao),
    issueDate: brDateToISO(omieInvoice.Emissao.cDataEmissao, omieInvoice.Emissao.cHoraEmissao),
    grossValue: multiply(omieInvoiceItem.nValorTotal, perc),
    netValue: multiply(omieInvoiceItem.nValorTotal - omieInvoiceItem.nDescontoValor - omieInvoiceItem.nValorOutrasDespesas, perc),
    discounts: multiply(omieInvoiceItem.nDescontoValor, perc),
    taxAmount: multiply(omieInvoiceItem.nValorCOFINS + omieInvoiceItem.nValorCSLL + omieInvoiceItem.nValorIR + omieInvoiceItem.nValorPIS + (omieInvoiceItem.nValorICMS ?? 0) + (omieInvoiceItem.nValorISS ?? 0), perc),
    taxes: {
      ir: multiply(omieInvoiceItem.nValorIR, perc),
      pis: multiply(omieInvoiceItem.nValorPIS, perc),
      cofins: multiply(omieInvoiceItem.nValorCOFINS, perc),
      csll: multiply(omieInvoiceItem.nValorCSLL, perc),
      icms: multiply(omieInvoiceItem.nValorICMS ?? 0, perc),
      iss: multiply(omieInvoiceItem.nValorISS ?? 0, perc)
    },
    cancelled: omieInvoice.Cabecalho.cStatusNFSe === 'C',
    denied: null,
    billed: omieInvoice.Cabecalho.cStatusNFSe === 'F'
  }
}
