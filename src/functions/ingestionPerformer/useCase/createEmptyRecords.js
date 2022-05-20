const { flags: { updateEmptyRecords } } = require('../../../config')
const { emptyProperties, uuidFrom } = require('../../../utils/helpers')
const {
  omieCategoriesResponseMock,
  omieDepartmentsResponseMock,
  omieProjectsResponseMock,
  omieCustomersResponseMock,
  omieCheckingAccountsResponseMock,
  omieProductsResponseMock,
  omieContractsResponseMock,
  omieProductOrdersResponseMock,
  omieProductInvoicesResponseMock,
  omieAccountsPayableResponseMock,
  omieAccountsReceivableResponseMock,
  omieFinancialMovementsResponseMock,

  omieContractBillingTypesResponseMock,
  omieContractStepsResponseMock,
  omieBillingStepsResponseMock,
  omieDocumentTypesResponseMock,
  omieEntryOriginsResponseMock
} = require('../../../../tests/mocks')

module.exports = async ({
  companyId,
  omieMappings,
  repositories
}) => {
  const makeEmptyRecord = (id, source) => {
    const { companyId, provider, isActive } = source
    const date = new Date()
    const emptyRecord = {
      ...emptyProperties(source, true),
      _id: id,
      companyId,
      provider,
      createdAt: date,
      updatedAt: date
    }
    if (isActive !== undefined) {
      emptyRecord.isActive = true
    }
    return emptyRecord
  }

  const emptyRecordsIds = {
    category: uuidFrom(`${companyId}-category`),
    department: uuidFrom(`${companyId}-department`),
    project: uuidFrom(`${companyId}-project`),
    customer: uuidFrom(`${companyId}-customer`),
    checkingAccount: uuidFrom(`${companyId}-checkingAccount`),
    productService: uuidFrom(`${companyId}-productService`),
    contract: uuidFrom(`${companyId}-contract`),
    order: uuidFrom(`${companyId}-order`),
    billing: uuidFrom(`${companyId}-billing`),
    accountPayable: uuidFrom(`${companyId}-accountPayable`),
    accountReceivable: uuidFrom(`${companyId}-accountReceivable`),
    financialMovement: uuidFrom(`${companyId}-financialMovement`)
  }

  const mappingsMap = {
    category: omieMappings.category,
    department: omieMappings.department,
    project: omieMappings.project,
    customer: omieMappings.customer,
    checkingAccount: omieMappings.checkingAccount,
    productService: omieMappings.product, /** can be product or service */
    contract: omieMappings.contract,
    order: omieMappings.productOrder, /** can be product or service */
    billing: omieMappings.productInvoice, /** can be product or service */
    accountPayable: omieMappings.title,
    accountReceivable: omieMappings.title,
    financialMovement: omieMappings.financialMovement
  }

  const mappingsPrametersMap = {
    category: { companyId, omieCategory: omieCategoriesResponseMock.categoria_cadastro[0] },
    department: { companyId, omieDepartment: omieDepartmentsResponseMock.departamentos[0] },
    project: { companyId, omieProject: omieProjectsResponseMock.cadastro[0] },
    customer: { companyId, omieCustomer: omieCustomersResponseMock.clientes_cadastro[0], omieCnae: [], omieActivities: [] },
    checkingAccount: { companyId, omieCheckingAccount: omieCheckingAccountsResponseMock.ListarContasCorrentes[0], omieBanks: [], omieCheckingAccountTypes: [] },
    productService: { companyId, omieProduct: omieProductsResponseMock.produto_servico_cadastro[0] },
    contract: { companyId, omieContract: omieContractsResponseMock.contratoCadastro[0], omieContractDepartment: omieContractsResponseMock.contratoCadastro[0].departamentos[0], omieContractItem: omieContractsResponseMock.contratoCadastro[0].itensContrato[0], omieContractBillingTypes: omieContractBillingTypesResponseMock.cadastros, omieContractSteps: omieContractStepsResponseMock, emptyRecordsIds: {} },
    order: { companyId, omieOrder: omieProductOrdersResponseMock.pedido_venda_produto[0], omieOrderDepartment: omieProductOrdersResponseMock.pedido_venda_produto[0].departamentos[0], omieOrderItem: omieProductOrdersResponseMock.pedido_venda_produto[0].det[0], omieBillingSteps: omieBillingStepsResponseMock.cadastros, emptyRecordsIds: {} },
    billing: { companyId, omieInvoice: omieProductInvoicesResponseMock.nfCadastro[0], omieInvoiceDepartment: omieProductInvoicesResponseMock.nfCadastro[0].pedido.Departamentos[0], omieInvoiceItem: omieProductInvoicesResponseMock.nfCadastro[0].det[0], emptyRecordsIds: {}, order: {} },
    accountPayable: { companyId, omieTitle: omieAccountsPayableResponseMock.titulosEncontrados[0], omieTitleEntry: omieAccountsPayableResponseMock.titulosEncontrados[0].lancamentos[0], omieTitleDepartment: omieAccountsPayableResponseMock.titulosEncontrados[0].departamentos[0], omieTitleCategory: omieAccountsPayableResponseMock.titulosEncontrados[0].cabecTitulo.aCodCateg[0], omieEntryOrigins: omieEntryOriginsResponseMock.origem, omieDocumentTypes: omieDocumentTypesResponseMock.tipo_documento_cadastro, order: {}, billing: {}, emptyRecordsIds: {} },
    accountReceivable: { companyId, omieTitle: omieAccountsReceivableResponseMock.titulosEncontrados[0], omieTitleEntry: omieAccountsReceivableResponseMock.titulosEncontrados[0].lancamentos[0], omieTitleDepartment: omieAccountsReceivableResponseMock.titulosEncontrados[0].departamentos[0], omieTitleCategory: omieAccountsReceivableResponseMock.titulosEncontrados[0].cabecTitulo.aCodCateg[0], omieEntryOrigins: omieEntryOriginsResponseMock.origem, omieDocumentTypes: omieDocumentTypesResponseMock.tipo_documento_cadastro, order: {}, billing: {}, emptyRecordsIds: {} },
    financialMovement: { companyId, omieFinancialMovement: omieFinancialMovementsResponseMock.movimentos[0], omieFinancialMovementDepartment: omieFinancialMovementsResponseMock.movimentos[0].departamentos[0], omieFinancialMovementCategory: omieFinancialMovementsResponseMock.movimentos[0].categorias[0], omieEntryOrigins: omieEntryOriginsResponseMock.origem, omieDocumentTypes: omieDocumentTypesResponseMock.tipo_documento_cadastro, emptyRecordsIds: {}, order: {}, billing: {} }
  }

  const repositoriesMap = {
    category: repositories.categories,
    department: repositories.departments,
    project: repositories.projects,
    customer: repositories.customers,
    checkingAccount: repositories.checkingAccounts,
    productService: repositories.productsServices,
    contract: repositories.contracts,
    order: repositories.orders,
    billing: repositories.billing,
    accountPayable: repositories.accountsPayable,
    accountReceivable: repositories.accountsReceivable,
    financialMovement: repositories.financialMovements
  }

  await Promise.all(Object.keys(emptyRecordsIds).map(async (entity) => {
    const id = emptyRecordsIds[entity]

    const repository = repositoriesMap[entity]

    const found = await repository.findOne({ _id: id })

    if (!found || updateEmptyRecords === true) {
      const mapping = mappingsMap[entity]
      const mappingPrameters = mappingsPrametersMap[entity]
      const source = mapping(mappingPrameters)
      const emptyRecord = makeEmptyRecord(id, source)
      await repository.createOrUpdateOneRaw({ _id: id }, emptyRecord)
    }
  }))

  return emptyRecordsIds
}
