const { PRODUCT_TYPES, ORDER_TYPES, MOVEMENT_STATUS } = require('../enums')
const getValidCodes = require('../utils/getValidCodes')
const joinRecordsByCfopAndMunicipalServiceCode = require('../utils/joinRecordsByCfopAndMunicipalServiceCode')
const makeEmptyRecord = require('../utils/makeEmptyRecord')

module.exports = async ({
  omieService,
  credentials,
  startDate,
  endDate,
  companyId,
  mappings,
  repositories,
  omieDocumentTypes,
  emptyRecordsIds
}) => {
  const updateBilling = async ({ credentials, companyId, startDate, endDate, emptyRecordsIds, productInvoiceMapping, serviceInvoiceMapping, repositories }) => {
    const [
      omieProductInvoices,
      omieServiceInvoices
    ] = await Promise.all([
      omieService.getProductInvoices(credentials, { startDate, endDate }),
      omieService.getServiceInvoices(credentials, { startDate, endDate })
    ])

    if (omieProductInvoices.length || omieServiceInvoices.length) {
      const customersSet = new Set()
      const projectsSet = new Set()
      const departmentsSet = new Set()
      const productsSet = new Set()
      const servicesSet = new Set()
      const contractsSet = new Set()
      const ordersSet = new Set()

      omieProductInvoices.forEach(omieInvoice => {
        customersSet.add(String(omieInvoice.nfDestInt.nCodCli))
        ordersSet.add(String(omieInvoice.compl.nIdPedido));
        (omieInvoice.pedido.Departamentos?.length ? omieInvoice.pedido.Departamentos : []).forEach(omieInvoiceDepartment => {
          departmentsSet.add(String(omieInvoiceDepartment.cCodigoDepartamento))
        })
        omieInvoice.det.forEach(omieInvoiceItem => {
          productsSet.add(String(omieInvoiceItem.nfProdInt.nCodProd))
        })
      })

      omieServiceInvoices.forEach(omieInvoice => {
        customersSet.add(String(omieInvoice.Cabecalho.nCodigoCliente))
        projectsSet.add(String(omieInvoice.Adicionais.nCodigoProjeto))
        contractsSet.add(String(omieInvoice.OrdemServico.nCodigoContrato))
        ordersSet.add(String(omieInvoice.OrdemServico.nCodigoOS));
        (omieInvoice.OrdemServico.Departamentos?.length ? omieInvoice.OrdemServico.Departamentos : []).forEach(omieInvoiceDepartment => {
          departmentsSet.add(String(omieInvoiceDepartment.cCodigoDepartamento))
        })
        omieInvoice.ListaServicos.forEach(omieInvoiceItem => {
          servicesSet.add(String(omieInvoiceItem.CodigoServico))
        })
      })

      const customersFilter = [...customersSet].filter(getValidCodes)
      const projectsFilter = [...projectsSet].filter(getValidCodes)
      const departmentsFilter = [...departmentsSet].filter(getValidCodes)
      const productsFilter = [...productsSet].filter(getValidCodes)
      const servicesFilter = [...servicesSet].filter(getValidCodes)
      const contractsFilter = [...contractsSet].filter(getValidCodes)
      const ordersFilter = [...ordersSet].filter(getValidCodes)

      const [
        customers,
        projects,
        departments,
        products,
        services,
        contracts,
        orders
      ] = await Promise.all([
        customersFilter.length ? repositories.customers.find({ companyId, externalId: customersFilter }) : [],
        projectsFilter.length ? repositories.projects.find({ companyId, externalId: projectsFilter }) : [],
        departmentsFilter.length ? repositories.departments.find({ companyId, externalId: departmentsFilter }) : [],
        productsFilter.length ? repositories.productsServices.find({ companyId, externalId: productsFilter, type: PRODUCT_TYPES.PRODUCT }) : [],
        servicesFilter.length ? repositories.productsServices.find({ companyId, municipalServiceCode: servicesFilter, type: PRODUCT_TYPES.SERVICE }) : [], /** Omie returns CodigoServico as municipalServiceCode in NFS-e API */
        contractsFilter.length ? repositories.contracts.find({ companyId, externalId: contractsFilter }) : [],
        ordersFilter.length ? repositories.orders.find({ companyId, externalId: ordersFilter }) : []
      ])

      const productInvoices = omieProductInvoices.map(omieInvoice => {
        const customer = customers.find(e => e.externalId === String(omieInvoice.nfDestInt.nCodCli))
        const salesOrders = orders.filter(e => e.externalId === String(omieInvoice.compl.nIdPedido) && e.type === ORDER_TYPES.SALES_ORDER)
        if (salesOrders.length || (!omieInvoice.compl.nIdPedido || omieInvoice.compl.nIdPedido === '0')) {
          return (omieInvoice.pedido.Departamentos?.length ? omieInvoice.pedido.Departamentos : [{}]).map(omieInvoiceDepartment => {
            const department = departments.find(e => e.externalId === String(omieInvoiceDepartment.cCodigoDepartamento))
            return omieInvoice.det.map(omieInvoiceItem => {
              const product = products.find(e => e.externalId === String(omieInvoiceItem.nfProdInt.nCodProd))
              const order = salesOrders.find(e => e.productServiceId === product?._id && [department?._id, emptyRecordsIds.department].includes(e.departmentId))
              return productInvoiceMapping({
                omieInvoice,
                omieInvoiceDepartment,
                omieInvoiceItem,
                order,
                emptyRecordsIds,
                companyId,
                customerId: customer?._id,
                projectId: order?.projectId,
                departmentId: department?._id,
                productServiceId: product?._id,
                categoryId: order?.categoryId
              })
            })
          })
        }
        return null
      }).filter(Boolean)
        .flatMap(x => x.flatMap(y => y))
        .reduce(joinRecordsByCfopAndMunicipalServiceCode, [])

      const serviceInvoices = omieServiceInvoices.map(omieInvoice => {
        const customer = customers.find(e => e.externalId === String(omieInvoice.Cabecalho.nCodigoCliente))
        const project = projects.find(e => e.externalId === String(omieInvoice.Adicionais.nCodigoProjeto))
        const contract = contracts.find(e => e.externalId === String(omieInvoice.OrdemServico.nCodigoContrato))
        const serviceOrders = orders.filter(e => e.externalId === String(omieInvoice.OrdemServico.nCodigoOS) && e.type === ORDER_TYPES.SERVICE_ORDER)
        return (omieInvoice.OrdemServico.Departamentos?.length ? omieInvoice.OrdemServico.Departamentos : [{}]).map(omieInvoiceDepartment => {
          const department = departments.find(e => e.externalId === String(omieInvoiceDepartment.cCodigoDepartamento))
          return omieInvoice.ListaServicos.map(omieInvoiceItem => {
            const service = services.find(e => e.municipalServiceCode === String(omieInvoiceItem.CodigoServico))
            const order = serviceOrders.find(e => e.productServiceId === service?._id && [department?._id, emptyRecordsIds.department].includes(e.departmentId))
            return serviceInvoiceMapping({
              omieInvoice,
              omieInvoiceDepartment,
              omieInvoiceItem,
              order,
              emptyRecordsIds,
              companyId,
              customerId: customer?._id,
              projectId: project?._id,
              departmentId: department?._id,
              productServiceId: service?._id,
              categoryId: order?.categoryId,
              contractId: contract?._id
            })
          })
        })
      }).flatMap(x => x.flatMap(y => y))
        .reduce(joinRecordsByCfopAndMunicipalServiceCode, [])

      const invoices = [...productInvoices, ...serviceInvoices]

      if (invoices.length) {
        const emptyRecord = makeEmptyRecord(emptyRecordsIds.billing, invoices[0])
        invoices.push(emptyRecord)
      }
      await repositories.billing.deleteOldAndCreateNew(['companyId', 'externalId', 'type'], invoices)
    }
  }

  const updateAccountsPayable = async ({ credentials, companyId, startDate, endDate, emptyRecordsIds, titleMapping, repositories }) => {
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
        customersFilter.length ? repositories.customers.find({ companyId, externalId: customersFilter }) : [],
        projectsFilter.length ? repositories.projects.find({ companyId, externalId: projectsFilter }) : [],
        categoriesFilter.length ? repositories.categories.find({ companyId, externalId: categoriesFilter }) : [],
        departmentsFilter.length ? repositories.departments.find({ companyId, externalId: departmentsFilter }) : [],
        contractsFilter.length ? repositories.contracts.find({ companyId, externalId: contractsFilter }) : [],
        ordersFilter.length ? repositories.orders.find({ companyId, externalId: ordersFilter }) : [],
        billingFilter.length ? repositories.billing.find({ companyId, externalId: billingFilter }) : []
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
              customerId: customer?._id,
              projectId: project?._id,
              departmentId: department?._id,
              categoryId: category?._id,
              emptyRecordsIds,
              contractId: contract?._id,
              order,
              billing: invoice
            })
          })
        })
      }).flatMap(x => x.flatMap(y => y.flatMap(z => z)))

      if (accountsPayable.length) {
        const emptyRecord = makeEmptyRecord(emptyRecordsIds.accountPayable, accountsPayable[0])
        accountsPayable.push(emptyRecord)
      }
      await repositories.accountsPayable.deleteOldAndCreateNew(['companyId', 'externalId', 'titleId'], accountsPayable)
    }
  }

  const updateAccountsReceivable = async ({ credentials, companyId, startDate, endDate, emptyRecordsIds, titleMapping, repositories }) => {
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
        customersFilter.length ? repositories.customers.find({ companyId, externalId: customersFilter }) : [],
        projectsFilter.length ? repositories.projects.find({ companyId, externalId: projectsFilter }) : [],
        categoriesFilter.length ? repositories.categories.find({ companyId, externalId: categoriesFilter }) : [],
        departmentsFilter.length ? repositories.departments.find({ companyId, externalId: departmentsFilter }) : [],
        contractsFilter.length ? repositories.contracts.find({ companyId, externalId: contractsFilter }) : [],
        ordersFilter.length ? repositories.orders.find({ companyId, externalId: ordersFilter }) : [],
        billingFilter.length ? repositories.billing.find({ companyId, externalId: billingFilter }) : []
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
              customerId: customer?._id,
              projectId: project?._id,
              departmentId: department?._id,
              categoryId: category?._id,
              emptyRecordsIds,
              contractId: contract?._id,
              order,
              billing: invoice
            })
          })
        })
      }).flatMap(x => x.flatMap(y => y.flatMap(z => z)))

      if (accountsReceivable.length) {
        const emptyRecord = makeEmptyRecord(emptyRecordsIds.accountReceivable, accountsReceivable[0])
        accountsReceivable.push(emptyRecord)
      }
      await repositories.accountsReceivable.deleteOldAndCreateNew(['companyId', 'externalId', 'titleId'], accountsReceivable)
    }
  }

  const updateFinancialMovements = async ({ credentials, companyId, startDate, endDate, emptyRecordsIds, financialMovementMapping, repositories }) => {
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
        customersFilter.length ? repositories.customers.find({ companyId, externalId: customersFilter }) : [],
        projectsFilter.length ? repositories.projects.find({ companyId, externalId: projectsFilter }) : [],
        categoriesFilter.length ? repositories.categories.find({ companyId, externalId: categoriesFilter }) : [],
        departmentsFilter.length ? repositories.departments.find({ companyId, externalId: departmentsFilter }) : [],
        checkingAccountsFilter.length ? repositories.checkingAccounts.find({ companyId, externalId: checkingAccountsFilter }) : [],
        contractsFilter.length ? repositories.contracts.find({ companyId, externalId: contractsFilter }) : [],
        ordersFilter.length ? repositories.orders.find({ companyId, externalId: ordersFilter }) : [],
        billingFilter.length ? repositories.billing.find({ companyId, externalId: billingFilter }) : [],
        titlesFilter.length ? repositories.accountsPayable.find({ companyId, externalId: titlesFilter }) : [],
        titlesFilter.length ? repositories.accountsReceivable.find({ companyId, externalId: titlesFilter }) : []
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
              customerId: customer?._id,
              projectId: project?._id,
              departmentId: department?._id,
              categoryId: category?._id,
              checkingAccountId: checkingAccount?._id,
              emptyRecordsIds,
              contractId: contract?._id,
              order,
              billing: invoice,
              accountPayableId: accountPayable?._id,
              accountReceivableId: accountReceivable?._id
            })
          })
        })
      }).flatMap(x => x.flatMap(y => y))

      const emptyRecord = makeEmptyRecord(emptyRecordsIds.financialMovement, financialMovements[0])
      financialMovements.push(emptyRecord)
      await repositories.financialMovements.deleteOldAndCreateNew(['companyId', 'externalId', 'movementId'], financialMovements)
    }
  }

  await updateBilling({
    credentials,
    companyId,
    emptyRecordsIds,
    startDate,
    endDate,
    productInvoiceMapping: mappings.productInvoiceMapping,
    serviceInvoiceMapping: mappings.serviceInvoiceMapping,
    repositories
  })

  await updateAccountsPayable({
    credentials,
    companyId,
    emptyRecordsIds,
    startDate,
    endDate,
    titleMapping: mappings.titleMapping,
    repositories
  })

  await updateAccountsReceivable({
    credentials,
    companyId,
    emptyRecordsIds,
    startDate,
    endDate,
    titleMapping: mappings.titleMapping,
    repositories
  })

  await updateFinancialMovements({
    credentials,
    companyId,
    emptyRecordsIds,
    startDate,
    endDate,
    financialMovementMapping: mappings.financialMovementMapping,
    repositories
  })
}
