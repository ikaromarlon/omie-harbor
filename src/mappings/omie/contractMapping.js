const { brDateToISO, multiply } = require('../../common/helpers')

module.exports = ({ providerName }) => ({
  omieContract,
  omieContractDepartment,
  omieContractItem,
  omieContractBillingTypes,
  omieContractSteps,
  emptyRecordsIds,
  companyId,
  customerId,
  projectId,
  departmentId,
  productServiceId,
  categoryId
}) => {
  const STATUS = {
    '00': 'EM ELABORAÇÃO',
    10: 'ATIVO',
    90: 'SUSPENSO',
    99: 'CANCELADO'
  }

  const step = omieContractSteps.find(x => x.contratos.some(y => String(y.nCodCtr) === String(omieContract.cabecalho.nCodCtr)))?.descricao || null

  const departmentPercentage = omieContractDepartment?.nPerDep ?? 100
  const perc = departmentPercentage / 100

  return {
    externalId: String(omieContract.cabecalho.nCodCtr),
    contractNumber: String(omieContract.cabecalho.cNumCtr),
    provider: providerName,
    companyId,
    customerId: customerId ?? emptyRecordsIds.customer,
    projectId: projectId ?? emptyRecordsIds.project,
    productServiceId: productServiceId ?? emptyRecordsIds.productService,
    categoryId: categoryId ?? emptyRecordsIds.category,
    departmentId: departmentId ?? emptyRecordsIds.department,
    departmentPercentage,
    type: 'SERVICO',
    municipalServiceCode: omieContractItem.itemCabecalho.codServMunic || null,
    registerDate: brDateToISO(omieContract.infoCadastro.dInc, omieContract.infoCadastro.hInc),
    startDate: brDateToISO(omieContract.cabecalho.dVigInicial),
    endDate: brDateToISO(omieContract.cabecalho.dVigFinal),
    expectedPaymentDay: omieContract.cabecalho.nDiaFat,
    grossValue: multiply(omieContractItem.itemCabecalho.valorTotal, perc),
    netValue: multiply(omieContractItem.itemCabecalho.valorTotal - omieContractItem.itemCabecalho.valorDesconto - omieContractItem.itemCabecalho.valorOutrasRetencoes - omieContractItem.itemCabecalho.valorDed + omieContractItem.itemCabecalho.valorAcrescimo, perc),
    discounts: multiply(omieContractItem.itemCabecalho.valorDesconto, perc),
    taxAmount: multiply(omieContractItem.itemCabecalho.valorOutrasRetencoes + omieContractItem.itemCabecalho.valorDed, perc),
    taxes: {
      ir: multiply(omieContractItem.itemImpostos.valorIR, perc),
      pis: multiply(omieContractItem.itemImpostos.valorPIS, perc),
      cofins: multiply(omieContractItem.itemImpostos.valorCOFINS, perc),
      csll: multiply(omieContractItem.itemImpostos.valorCSLL, perc),
      icms: multiply(omieContractItem.itemImpostos.valorICMS ?? 0, perc),
      iss: multiply(omieContractItem.itemImpostos.valorISS ?? 0, perc)
    },
    status: STATUS[omieContract.cabecalho.cCodSit],
    billed: null,
    billingType: omieContractBillingTypes.find(e => e.cCodigo === omieContract.cabecalho.cTipoFat).cDescricao,
    step,
    notes: omieContract.observacoes?.cObsContrato || null
  }
}
