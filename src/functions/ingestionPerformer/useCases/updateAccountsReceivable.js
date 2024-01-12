const getValidCodes = require('../utils/getValidCodes')

module.exports = async ({
  omieService,
  credentials,
  companyId,
  startDate,
  endDate,
  titleMapping,
  repositories,
  omieDocumentTypes
}) => {
  const [
    omieAccountsReceivableCreated,
    omieAccountsReceivableUpdated
  ] = await Promise.all([
    omieService.getAccountsReceivable(credentials, { createdFrom: startDate, createdTo: endDate }),
    omieService.getAccountsReceivable(credentials, { updatedFrom: startDate, updatedTo: endDate })
  ])

  const omieAccountsReceivable = Array.from(
    [...omieAccountsReceivableCreated, ...omieAccountsReceivableUpdated]
      .reduce((acc, el) => { acc.set(el.cabecTitulo.nCodTitulo, el); return acc }, new Map())
      .values()
  )

  if (omieAccountsReceivable.length) {
    const customersSet = new Set()
    const projectsSet = new Set()
    const categoriesSet = new Set()
    const departmentsSet = new Set()
    const contractsSet = new Set()
    const ordersSet = new Set()
    const billingSet = new Set()

    omieAccountsReceivable.forEach(omieAccountReceivable => {
      customersSet.add(String(omieAccountReceivable.cabecTitulo.nCodCliente))
      projectsSet.add(String(omieAccountReceivable.cabecTitulo.cCodProjeto))
      contractsSet.add(String(omieAccountReceivable.cabecTitulo.nCodCtr))
      ordersSet.add(String(omieAccountReceivable.cabecTitulo.nCodOS))
      billingSet.add(String(omieAccountReceivable.cabecTitulo.nCodNF));
      (omieAccountReceivable.departamentos?.length ? omieAccountReceivable.departamentos : []).forEach(omieAccountReceivableDepartment => {
        departmentsSet.add(String(omieAccountReceivableDepartment.cCodDepartamento))
      });
      (omieAccountReceivable.cabecTitulo.aCodCateg?.length ? omieAccountReceivable.cabecTitulo.aCodCateg : [{ cCodCateg: omieAccountReceivable.cabecTitulo.cCodCateg }]).forEach(omieAccountReceivableCategory => {
        categoriesSet.add(String(omieAccountReceivableCategory.cCodCateg))
      })
    })

    const customersFilter = [...customersSet].filter(getValidCodes)
    const projectsFilter = [...projectsSet].filter(getValidCodes)
    const categoriesFilter = [...categoriesSet].filter(getValidCodes)
    const departmentsFilter = [...departmentsSet].filter(getValidCodes)
    const contractsFilter = [...contractsSet].filter(getValidCodes)
    const ordersFilter = [...ordersSet].filter(getValidCodes)
    const billingFilter = [...billingSet].filter(getValidCodes)

    const [
      customers,
      projects,
      categories,
      departments,
      contracts,
      orders,
      billing
    ] = await Promise.all([
      customersFilter.length ? repositories.customers.findMany({ companyId, externalId: customersFilter }) : [],
      projectsFilter.length ? repositories.projects.findMany({ companyId, externalId: projectsFilter }) : [],
      categoriesFilter.length ? repositories.categories.findMany({ companyId, externalId: categoriesFilter }) : [],
      departmentsFilter.length ? repositories.departments.findMany({ companyId, externalId: departmentsFilter }) : [],
      contractsFilter.length ? repositories.contracts.findMany({ companyId, externalId: contractsFilter }) : [],
      ordersFilter.length ? repositories.orders.findMany({ companyId, externalId: ordersFilter }) : [],
      billingFilter.length ? repositories.billing.findMany({ companyId, externalId: billingFilter }) : []
    ])

    const accountsReceivable = omieAccountsReceivable.map(omieAccountReceivable => {
      const customer = customers.find(e => e.externalId === String(omieAccountReceivable.cabecTitulo.nCodCliente))
      const project = projects.find(e => e.externalId === String(omieAccountReceivable.cabecTitulo.cCodProjeto))
      const contract = contracts.find(e => e.externalId === String(omieAccountReceivable.cabecTitulo.nCodCtr))
      const order = orders.find(e => e.externalId === String(omieAccountReceivable.cabecTitulo.nCodOS))
      const invoice = billing.find(e => e.externalId === String(omieAccountReceivable.cabecTitulo.nCodNF))
      return (omieAccountReceivable.departamentos?.length ? omieAccountReceivable.departamentos : [{}]).map(omieAccountReceivableDepartment => {
        const department = departments.find(e => e.externalId === String(omieAccountReceivableDepartment.cCodDepartamento))
        return (omieAccountReceivable.cabecTitulo.aCodCateg?.length ? omieAccountReceivable.cabecTitulo.aCodCateg : [{ cCodCateg: omieAccountReceivable.cabecTitulo.cCodCateg }]).map(omieAccountReceivableCategory => {
          const category = categories.find(e => e.externalId === String(omieAccountReceivableCategory.cCodCateg))
          return titleMapping({
            omieTitle: omieAccountReceivable,
            omieTitleEntries: omieAccountReceivable.lancamentos ?? [],
            omieTitleDepartment: omieAccountReceivableDepartment,
            omieTitleCategory: omieAccountReceivableCategory,
            omieDocumentTypes,
            companyId,
            customerId: customer?.id,
            projectId: project?.id,
            departmentId: department?.id,
            categoryId: category?.id,
            contractId: contract?.id,
            order,
            billing: invoice
          })
        })
      })
    }).flatMap(x => x.flatMap(y => y.flatMap(z => z)))

    await repositories.accountsReceivable.deleteOldAndCreateNew(accountsReceivable, ['companyId', 'externalId', 'titleId'])
  }
}
