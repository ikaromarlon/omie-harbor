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
  emptyRecordsIds
}) => {
  const ORDER_OPERATION_CODE = '11'

  const omieBillingStep = omieBillingSteps
    .find(e => e.cCodOperacao === ORDER_OPERATION_CODE)
    .etapas
    .find(e => e.cCodigo === omieOrder.cabecalho.etapa)

  const departmentPercentage = omieOrderDepartment?.nPerc ?? 100
  const perc = departmentPercentage / 100

  return {
    externalId: String(omieOrder.cabecalho.codigo_pedido),
    orderNumber: String(omieOrder.cabecalho.numero_pedido),
    provider: providerName,
    companyId,
    customerId: customerId ?? emptyRecordsIds.customer,
    projectId: projectId ?? emptyRecordsIds.project,
    productServiceId: productServiceId ?? emptyRecordsIds.productService,
    categoryId: categoryId ?? emptyRecordsIds.category,
    departmentId: departmentId ?? emptyRecordsIds.department,
    departmentPercentage,
    cfop: omieOrderItem.produto.cfop || null,
    municipalServiceCode: null, /** only for OS */
    contractId: emptyRecordsIds.contract, /** only for OS */
    type: ORDER_TYPES.SALES_ORDER,
    registerDate: brDateToISO(omieOrder.infoCadastro.dInc, omieOrder.infoCadastro.hInc),
    expectedPaymentDate: brDateToISO(omieOrder.cabecalho.data_previsao),
    grossValue: multiply(omieOrderItem.produto.valor_mercadoria, perc),
    netValue: multiply(omieOrderItem.produto.valor_total - omieOrderItem.produto.valor_desconto - omieOrderItem.produto.valor_deducao, perc),
    discounts: multiply(omieOrderItem.produto.valor_desconto, perc),
    taxAmount: multiply(omieOrderItem.produto.valor_deducao, perc),
    taxes: {
      ir: multiply(omieOrderItem.imposto.irrf.valor_irrf, perc),
      pis: multiply(omieOrderItem.imposto.pis_padrao.valor_pis + (omieOrderItem.imposto.pis_st?.valor_pis_st ?? 0), perc),
      cofins: multiply(omieOrderItem.imposto.cofins_padrao.valor_cofins + (omieOrderItem.imposto.cofins_st?.valor_cofins_st ?? 0), perc),
      csll: multiply(omieOrderItem.imposto.csll.valor_csll, perc),
      icms: multiply((omieOrderItem.imposto.icms.valor_icms ?? 0) + (omieOrderItem.imposto.icms_sn.valor_icms_sn ?? 0) + (omieOrderItem.imposto.icms_st.valor_icms_st ?? 0), perc),
      iss: multiply(omieOrderItem.imposto.iss.valor_iss, perc)
    },
    authorized: omieOrder.infoCadastro.autorizado === 'S',
    cancelled: omieOrder.infoCadastro.cancelado === 'S',
    denied: omieOrder.infoCadastro.denegado === 'S',
    returned: omieOrder.infoCadastro.devolvido === 'S',
    partiallyReturned: omieOrder.infoCadastro.devolvido_parcial === 'S',
    billed: omieOrder.infoCadastro.faturado === 'S',
    billingStep: omieBillingStep.cDescricao || omieBillingStep.cDescrPadrao,
    notes: omieOrder.observacoes?.obs_venda || null
  }
}
