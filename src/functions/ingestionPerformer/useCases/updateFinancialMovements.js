const { MOVEMENT_STATUS } = require('../enums')
const getValidCodes = require('../utils/getValidCodes')

module.exports = async ({
  omieService,
  credentials,
  companyId,
  startDate,
  endDate,
  financialMovementMapping,
  repositories,
  omieDocumentTypes
}) => {
  const [
    omieFinancialMovementsCreatedResult,
    omieFinancialMovementsUpdatedResult
  ] = await Promise.all([
    omieService.getFinancialMovements(credentials, { createdFrom: startDate, createdTo: endDate }),
    omieService.getFinancialMovements(credentials, { updatedFrom: startDate, updatedTo: endDate })
  ])

  const isConsolidatedMovement = (omieMovement) => omieMovement.detalhes.cStatus !== MOVEMENT_STATUS.FORECAST

  const omieFinancialMovementsCreated = omieFinancialMovementsCreatedResult.filter(isConsolidatedMovement)
  const omieFinancialMovementsUpdated = omieFinancialMovementsUpdatedResult.filter(isConsolidatedMovement)

  const omieFinancialMovements = Array.from(
    [...omieFinancialMovementsCreated, ...omieFinancialMovementsUpdated]
      .reduce((acc, el) => { acc.set(`${el.detalhes.nCodMovCCRepet}-${el.detalhes.nCodMovCC}-${el.detalhes.nCodTitRepet}-${el.detalhes.nCodTitulo}`, el); return acc }, new Map())
      .values()
  )

  if (omieFinancialMovements.length) {
    const omieEntryOrigins = await omieService.getEntryOrigins(credentials)

    const customersSet = new Set()
    const projectsSet = new Set()
    const categoriesSet = new Set()
    const departmentsSet = new Set()
    const checkingAccountsSet = new Set()
    const contractsSet = new Set()
    const ordersSet = new Set()
    const billingSet = new Set()
    const titlesSet = new Set()

    omieFinancialMovements.forEach(omieFinancialMovement => {
      customersSet.add(String(omieFinancialMovement.detalhes.nCodCliente))
      projectsSet.add(String(omieFinancialMovement.detalhes.cCodProjeto))
      checkingAccountsSet.add(String(omieFinancialMovement.detalhes.nCodCC))
      contractsSet.add(String(omieFinancialMovement.detalhes.nCodCtr))
      ordersSet.add(String(omieFinancialMovement.detalhes.nCodOS))
      billingSet.add(String(omieFinancialMovement.detalhes.nCodNF))
      titlesSet.add(String(omieFinancialMovement.detalhes.nCodTitulo));
      (omieFinancialMovement.departamentos?.length ? omieFinancialMovement.departamentos : []).forEach(omieFinancialMovementDepartment => {
        departmentsSet.add(String(omieFinancialMovementDepartment.cCodDepartamento))
      });
      (omieFinancialMovement.categorias?.length ? omieFinancialMovement.categorias : [{ cCodCateg: omieFinancialMovement.detalhes.cCodCateg }]).forEach(omieFinancialMovementCategory => {
        categoriesSet.add(String(omieFinancialMovementCategory.cCodCateg))
      })
    })

    const customersFilter = [...customersSet].filter(getValidCodes)
    const projectsFilter = [...projectsSet].filter(getValidCodes)
    const categoriesFilter = [...categoriesSet].filter(getValidCodes)
    const departmentsFilter = [...departmentsSet].filter(getValidCodes)
    const checkingAccountsFilter = [...checkingAccountsSet].filter(getValidCodes)
    const contractsFilter = [...contractsSet].filter(getValidCodes)
    const ordersFilter = [...ordersSet].filter(getValidCodes)
    const billingFilter = [...billingSet].filter(getValidCodes)
    const titlesFilter = [...titlesSet].filter(getValidCodes)

    const [
      customers,
      projects,
      categories,
      departments,
      checkingAccounts,
      contracts,
      orders,
      billing,
      accountsPayable,
      accountsReceivable
    ] = await Promise.all([
      customersFilter.length ? repositories.customers.findMany({ companyId, externalId: customersFilter }) : [],
      projectsFilter.length ? repositories.projects.findMany({ companyId, externalId: projectsFilter }) : [],
      categoriesFilter.length ? repositories.categories.findMany({ companyId, externalId: categoriesFilter }) : [],
      departmentsFilter.length ? repositories.departments.findMany({ companyId, externalId: departmentsFilter }) : [],
      checkingAccountsFilter.length ? repositories.checkingAccounts.findMany({ companyId, externalId: checkingAccountsFilter }) : [],
      contractsFilter.length ? repositories.contracts.findMany({ companyId, externalId: contractsFilter }) : [],
      ordersFilter.length ? repositories.orders.findMany({ companyId, externalId: ordersFilter }) : [],
      billingFilter.length ? repositories.billing.findMany({ companyId, externalId: billingFilter }) : [],
      titlesFilter.length ? repositories.accountsPayable.findMany({ companyId, externalId: titlesFilter }) : [],
      titlesFilter.length ? repositories.accountsReceivable.findMany({ companyId, externalId: titlesFilter }) : []
    ])

    const financialMovements = omieFinancialMovements.map(omieFinancialMovement => {
      const customer = customers.find(e => e.externalId === String(omieFinancialMovement.detalhes.nCodCliente))
      const project = projects.find(e => e.externalId === String(omieFinancialMovement.detalhes.cCodProjeto))
      const checkingAccount = checkingAccounts.find(e => e.externalId === String(omieFinancialMovement.detalhes.nCodCC))
      const contract = contracts.find(e => e.externalId === String(omieFinancialMovement.detalhes.nCodCtr))
      const order = orders.find(e => e.externalId === String(omieFinancialMovement.detalhes.nCodOS))
      const invoice = billing.find(e => e.externalId === String(omieFinancialMovement.detalhes.nCodNF))
      const accountPayable = accountsPayable.find(e => e.externalId === String(omieFinancialMovement.detalhes.nCodTitulo))
      const accountReceivable = accountsReceivable.find(e => e.externalId === String(omieFinancialMovement.detalhes.nCodTitulo))
      return (omieFinancialMovement.departamentos?.length ? omieFinancialMovement.departamentos : [{}]).map(omieFinancialMovementDepartment => {
        const department = departments.find(e => e.externalId === String(omieFinancialMovementDepartment.cCodDepartamento))
        return (omieFinancialMovement.categorias?.length ? omieFinancialMovement.categorias : [{ cCodCateg: omieFinancialMovement.detalhes.cCodCateg }]).map(omieFinancialMovementCategory => {
          const category = categories.find(e => e.externalId === String(omieFinancialMovementCategory.cCodCateg))
          return financialMovementMapping({
            omieFinancialMovement,
            omieFinancialMovementDepartment,
            omieFinancialMovementCategory,
            omieEntryOrigins,
            omieDocumentTypes,
            companyId,
            customerId: customer?.id,
            projectId: project?.id,
            departmentId: department?.id,
            categoryId: category?.id,
            checkingAccountId: checkingAccount?.id,
            contractId: contract?.id,
            order,
            billing: invoice,
            accountPayableId: accountPayable?.id,
            accountReceivableId: accountReceivable?.id
          })
        })
      })
    }).flatMap(x => x.flatMap(y => y))

    await repositories.financialMovements.deleteOldAndCreateNew(financialMovements, ['companyId', 'externalId', 'movementId'])
  }
}
