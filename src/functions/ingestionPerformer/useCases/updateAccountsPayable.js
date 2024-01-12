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
    omieAccountsPayableCreated,
    omieAccountsPayableUpdated
  ] = await Promise.all([
    omieService.getAccountsPayable(credentials, { createdFrom: startDate, createdTo: endDate }),
    omieService.getAccountsPayable(credentials, { updatedFrom: startDate, updatedTo: endDate })
  ])

  const omieAccountsPayable = Array.from(
    [...omieAccountsPayableCreated, ...omieAccountsPayableUpdated]
      .reduce((acc, el) => { acc.set(el.cabecTitulo.nCodTitulo, el); return acc }, new Map())
      .values()
  )

  if (omieAccountsPayable.length) {
    const customersSet = new Set()
    const projectsSet = new Set()
    const categoriesSet = new Set()
    const departmentsSet = new Set()
    const contractsSet = new Set()
    const ordersSet = new Set()
    const billingSet = new Set()

    omieAccountsPayable.forEach(omieAccountPayable => {
      customersSet.add(String(omieAccountPayable.cabecTitulo.nCodCliente))
      projectsSet.add(String(omieAccountPayable.cabecTitulo.cCodProjeto))
      contractsSet.add(String(omieAccountPayable.cabecTitulo.nCodCtr))
      ordersSet.add(String(omieAccountPayable.cabecTitulo.nCodOS))
      billingSet.add(String(omieAccountPayable.cabecTitulo.nCodNF));
      (omieAccountPayable.departamentos?.length ? omieAccountPayable.departamentos : []).forEach(omieAccountPayableDepartment => {
        departmentsSet.add(String(omieAccountPayableDepartment.cCodDepartamento))
      });
      (omieAccountPayable.cabecTitulo.aCodCateg?.length ? omieAccountPayable.cabecTitulo.aCodCateg : [{ cCodCateg: omieAccountPayable.cabecTitulo.cCodCateg }]).forEach(omieAccountPayableCategory => {
        categoriesSet.add(String(omieAccountPayableCategory.cCodCateg))
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

    const accountsPayable = omieAccountsPayable.map(omieAccountPayable => {
      const customer = customers.find(e => e.externalId === String(omieAccountPayable.cabecTitulo.nCodCliente))
      const project = projects.find(e => e.externalId === String(omieAccountPayable.cabecTitulo.cCodProjeto))
      const contract = contracts.find(e => e.externalId === String(omieAccountPayable.cabecTitulo.nCodCtr))
      const order = orders.find(e => e.externalId === String(omieAccountPayable.cabecTitulo.nCodOS))
      const invoice = billing.find(e => e.externalId === String(omieAccountPayable.cabecTitulo.nCodNF))
      return (omieAccountPayable.departamentos?.length ? omieAccountPayable.departamentos : [{}]).map(omieAccountPayableDepartment => {
        const department = departments.find(e => e.externalId === String(omieAccountPayableDepartment.cCodDepartamento))
        return (omieAccountPayable.cabecTitulo.aCodCateg?.length ? omieAccountPayable.cabecTitulo.aCodCateg : [{ cCodCateg: omieAccountPayable.cabecTitulo.cCodCateg }]).map(omieAccountPayableCategory => {
          const category = categories.find(e => e.externalId === String(omieAccountPayableCategory.cCodCateg))
          return titleMapping({
            omieTitle: omieAccountPayable,
            omieTitleEntries: omieAccountPayable.lancamentos ?? [],
            omieTitleDepartment: omieAccountPayableDepartment,
            omieTitleCategory: omieAccountPayableCategory,
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

    await repositories.accountsPayable.deleteOldAndCreateNew(accountsPayable, ['companyId', 'externalId', 'titleId'])
  }
}
