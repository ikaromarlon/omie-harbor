const { ORDER_TYPES } = require('../enums')
const { brDateToISO, multiply } = require('../../../common/utils')

module.exports = ({
  companyId,
  omieOrder,
  omieOrderDepartment,
  omieOrderItem,
  omieBillingSteps,
  customerId,
  projectId,
  departmentId,
  productServiceId,
  categoryId,
  contractId
}) => {
  const ORDER_OPERATION_CODE = '01'

  const omieBillingStep = omieBillingSteps
    .find(e => e.cCodOperacao === ORDER_OPERATION_CODE).etapas
    .find(e => e.cCodigo === omieOrder.Cabecalho.cEtapa)

  const departmentPercentage = omieOrderDepartment?.nPerc ?? 100
  const perc = departmentPercentage / 100

  return {
    companyId,
    externalId: String(omieOrder.Cabecalho.nCodOS),
    orderNumber: String(omieOrder.Cabecalho.cNumOS),
    customerId: customerId ?? null,
    projectId: projectId ?? null,
    productServiceId: productServiceId ?? null,
    categoryId: categoryId ?? null,
    departmentId: departmentId ?? null,
    departmentPercentage,
    cfop: null, /** only for PEDIDO */
    municipalServiceCode: omieOrderItem.cCodServMun || null,
    contractId: contractId ?? null,
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
