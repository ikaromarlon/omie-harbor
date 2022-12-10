const { ORDER_TYPES } = require('../../common/enums')
const { brDateToISO, multiply } = require('../../common/helpers')

module.exports = ({ providerName }) => ({
  omieOrder,
  omieOrderDepartment,
  omieOrderItem,
  omieBillingSteps,
  companyId,
  customerId,
  projectId,
  departmentId,
  productServiceId,
  categoryId,
  emptyRecordsIds,
  contractId
}) => {
  const ORDER_OPERATION_CODE = '01'

  const omieBillingStep = omieBillingSteps
    .find(e => e.cCodOperacao === ORDER_OPERATION_CODE).etapas
    .find(e => e.cCodigo === omieOrder.Cabecalho.cEtapa)

  const departmentPercentage = omieOrderDepartment?.nPerc ?? 100
  const perc = departmentPercentage / 100

  return {
    externalId: String(omieOrder.Cabecalho.nCodOS),
    orderNumber: String(omieOrder.Cabecalho.cNumOS),
    provider: providerName,
    companyId,
    customerId: customerId ?? emptyRecordsIds.customer,
    projectId: projectId ?? emptyRecordsIds.project,
    productServiceId: productServiceId ?? emptyRecordsIds.productService,
    categoryId: categoryId ?? emptyRecordsIds.category,
    departmentId: departmentId ?? emptyRecordsIds.department,
    departmentPercentage,
    cfop: null, /** only for PEDIDO */
    municipalServiceCode: omieOrderItem.cCodServMun || null,
    contractId: contractId ?? emptyRecordsIds.contract,
    type: ORDER_TYPES.SERVICE_ORDER,
    registerDate: brDateToISO(omieOrder.InfoCadastro.dDtInc, omieOrder.InfoCadastro.cHrInc),
    expectedPaymentDate: brDateToISO(omieOrder.Cabecalho.dDtPrevisao),
    grossValue: multiply(omieOrderItem.nValUnit, perc),
    netValue: multiply(omieOrderItem.nValUnit - omieOrderItem.nValorDesconto - omieOrderItem.nValorOutrasRetencoes + omieOrderItem.nValorAcrescimos, perc),
    discounts: multiply(omieOrderItem.nValorDesconto, perc),
    taxAmount: multiply(omieOrderItem.nValorOutrasRetencoes, perc),
    taxes: {
      ir: multiply(omieOrderItem.impostos.nValorIRRF, perc),
      pis: multiply(omieOrderItem.impostos.nValorPIS, perc),
      cofins: multiply(omieOrderItem.impostos.nValorCOFINS, perc),
      csll: multiply(omieOrderItem.impostos.nValorCSLL, perc),
      icms: multiply(omieOrderItem.impostos.nValorICMS ?? 0, perc),
      iss: multiply(omieOrderItem.impostos.nValorISS ?? 0, perc)
    },
    authorized: null, /** only for PEDIDO */
    cancelled: omieOrder.InfoCadastro.cCancelada === 'S',
    denied: null, /** only for PEDIDO */
    returned: null, /** only for PEDIDO */
    partiallyReturned: null, /** only for PEDIDO */
    billed: omieOrder.InfoCadastro.cFaturada === 'S',
    billingStep: omieBillingStep.cDescricao || omieBillingStep.cDescrPadrao,
    notes: omieOrder.Observacoes?.cObsOS || null
  }
}
