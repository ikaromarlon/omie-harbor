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
  order
}) => {
  const departmentPercentage = omieInvoiceDepartment?.nPercentualDistribuicao ?? 100
  const perc = departmentPercentage / 100

  return {
    companyId,
    externalId: String(omieInvoice.compl.nIdNF),
    documentKey: omieInvoice.compl.cChaveNFe,
    documentNumber: omieInvoice.ide.nNF,
    documentSerie: omieInvoice.ide.serie,
    orderId: order?.id ?? null,
    orderNumber: order?.orderNumber ?? null,
    customerId: customerId ?? null,
    projectId: projectId ?? null,
    productServiceId: productServiceId ?? null,
    categoryId: categoryId ?? null,
    departmentId: departmentId ?? null,
    departmentPercentage,
    cfop: omieInvoiceItem.prod.CFOP || null,
    municipalServiceCode: null, /** only for NFS-e */
    contractId: null, /** only for NFS-e */
    origin: order?.type ?? null,
    type: 'NF-e',
    registerDate: brDateToISO(omieInvoice.info.dInc, omieInvoice.info.hInc),
    issueDate: brDateToISO(omieInvoice.ide.dEmi, omieInvoice.ide.hEmi),
    grossValue: multiply(omieInvoiceItem.prod.vTotItem, perc),
    netValue: multiply(omieInvoiceItem.prod.vTotItem - omieInvoiceItem.prod.vDesc - multiply(omieInvoiceItem.prod.vUnTrib, omieInvoiceItem.prod.qTrib), perc),
    discounts: multiply(omieInvoiceItem.prod.vDesc, perc),
    taxAmount: multiply(multiply(omieInvoiceItem.prod.vUnTrib, omieInvoiceItem.prod.qTrib), perc),
    taxes: {
      ir: multiply(omieInvoiceItem.prod.vIR ?? 0, perc),
      pis: multiply(omieInvoiceItem.prod.vPIS ?? 0, perc),
      cofins: multiply(omieInvoiceItem.prod.vCOFINS ?? 0, perc),
      csll: multiply(omieInvoiceItem.prod.vCSLL ?? 0, perc),
      icms: multiply(omieInvoiceItem.prod.vICMS ?? 0, perc),
      iss: multiply(omieInvoiceItem.prod.vISS ?? 0, perc)
    },
    cancelled: !!omieInvoice.ide.dCan,
    denied: omieInvoice.ide.cDeneg === 'S',
    billed: null
  }
}
