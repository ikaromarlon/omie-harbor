module.exports = async ({
  omieService,
  credentials,
  startDate,
  endDate,
  companyId,
  omieMappings,
  repositories,
  omieDocumentTypes,
  emptyRecordsIds,
  makeEmptyRecord,
  joinRecordsByCfopAndMunicipalServiceCode
}) => {
  const updateBilling = async ({ credentials, companyId, startDate, endDate, emptyRecordsIds, productInvoiceMapping, serviceInvoiceMapping, productTaxCouponMapping, repositories }) => {
    const [
      omieProductInvoices,
      omieServiceInvoices
      // omieTaxCoupons,
      // omieTaxCouponsItems
    ] = await Promise.all([
      omieService.getProductInvoices(credentials, { startDate, endDate }),
      omieService.getServiceInvoices(credentials, { startDate, endDate })
      // omieService.getTaxCoupons(credentials, { startDate, endDate }),
      // omieService.getTaxCouponsItems(credentials, { startDate, endDate })
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
        customersSet.add(String(omieInvoice.nfDestInt.nCodCli || ''))
        ordersSet.add(String(omieInvoice.compl.nIdPedido || ''));
        (omieInvoice.pedido.Departamentos?.length ? omieInvoice.pedido.Departamentos : []).forEach(omieInvoiceDepartment => {
          departmentsSet.add(String(omieInvoiceDepartment.cCodigoDepartamento || ''))
        })
        omieInvoice.det.forEach(omieInvoiceItem => {
          productsSet.add(String(omieInvoiceItem.nfProdInt.nCodProd || ''))
        })
      })

      omieServiceInvoices.forEach(omieInvoice => {
        customersSet.add(String(omieInvoice.Cabecalho.nCodigoCliente || ''))
        projectsSet.add(String(omieInvoice.Adicionais.nCodigoProjeto || ''))
        contractsSet.add(String(omieInvoice.OrdemServico.nCodigoContrato || ''))
        ordersSet.add(String(omieInvoice.OrdemServico.nCodigoOS || ''));
        (omieInvoice.OrdemServico.Departamentos?.length ? omieInvoice.OrdemServico.Departamentos : []).forEach(omieInvoiceDepartment => {
          departmentsSet.add(String(omieInvoiceDepartment.cCodigoDepartamento || ''))
        })
        omieInvoice.ListaServicos.forEach(omieInvoiceItem => {
          servicesSet.add(String(omieInvoiceItem.CodigoServico || ''))
        })
      })

      const customersFilter = [...customersSet].filter(Boolean)
      const projectsFilter = [...projectsSet].filter(Boolean)
      const departmentsFilter = [...departmentsSet].filter(Boolean)
      const productsFilter = [...productsSet].filter(Boolean)
      const servicesFilter = [...servicesSet].filter(Boolean)
      const contractsFilter = [...contractsSet].filter(Boolean)
      const ordersFilter = [...ordersSet].filter(Boolean)

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
        productsFilter.length ? repositories.productsServices.find({ companyId, externalId: productsFilter, type: 'PRODUTO' }) : [],
        servicesFilter.length ? repositories.productsServices.find({ companyId, municipalServiceCode: servicesFilter, type: 'SERVICO' }) : [], /** Omie returns CodigoServico as municipalServiceCode in NFS-e API */
        contractsFilter.length ? repositories.contracts.find({ companyId, externalId: contractsFilter }) : [],
        ordersFilter.length ? repositories.orders.find({ companyId, externalId: ordersFilter }) : []
      ])

      const productInvoices = omieProductInvoices.map(omieInvoice => {
        const customer = customers.find(e => e.externalId === String(omieInvoice.nfDestInt.nCodCli))
        const salesOrders = orders.filter(e => e.customerId === customer?._id && e.externalId === String(omieInvoice.compl.nIdPedido) && e.type === 'PEDIDO')
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
        const serviceOrders = orders.filter(e => e.customerId === customer._id && e.externalId === String(omieInvoice.OrdemServico.nCodigoOS) && e.type === 'OS')
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
        const emptyRecord = await makeEmptyRecord(emptyRecordsIds.billing, invoices[0])
        invoices.push(emptyRecord)
      }
      await repositories.billing.deleteOldAndCreateNew(['companyId', 'customerId', 'externalId', 'type'], invoices)
    }
  }

  const updateAccountsPayable = async ({ credentials, companyId, startDate, endDate, emptyRecordsIds, titleMapping, repositories }) => {
    const omieAccountsPayable = await omieService.getAccountsPayable(credentials, { startDate, endDate })

    if (omieAccountsPayable.length) {
      const customersSet = new Set()
      const projectsSet = new Set()
      const categoriesSet = new Set()
      const departmentsSet = new Set()
      const contractsSet = new Set()
      const ordersSet = new Set()
      const billingSet = new Set()

      omieAccountsPayable.forEach(omieAccountPayable => {
        customersSet.add(String(omieAccountPayable.cabecTitulo.nCodCliente || ''))
        projectsSet.add(String(omieAccountPayable.cabecTitulo.cCodProjeto || ''))
        contractsSet.add(String(omieAccountPayable.cabecTitulo.nCodCtr || ''))
        ordersSet.add(String(omieAccountPayable.cabecTitulo.nCodOS || ''))
        billingSet.add(String(omieAccountPayable.cabecTitulo.nCodNF || ''));
        (omieAccountPayable.departamentos?.length ? omieAccountPayable.departamentos : []).forEach(omieAccountPayableDepartment => {
          departmentsSet.add(String(omieAccountPayableDepartment.cCodDepartamento || ''))
        });
        (omieAccountPayable.cabecTitulo.aCodCateg?.length ? omieAccountPayable.cabecTitulo.aCodCateg : [{ cCodCateg: omieAccountPayable.cabecTitulo.cCodCateg }]).forEach(omieAccountPayableCategory => {
          categoriesSet.add(String(omieAccountPayableCategory.cCodCateg || ''))
        })
      })

      const customersFilter = [...customersSet].filter(Boolean)
      const projectsFilter = [...projectsSet].filter(Boolean)
      const categoriesFilter = [...categoriesSet].filter(Boolean)
      const departmentsFilter = [...departmentsSet].filter(Boolean)
      const contractsFilter = [...contractsSet].filter(Boolean)
      const ordersFilter = [...ordersSet].filter(Boolean)
      const billingFilter = [...billingSet].filter(Boolean)

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
        const order = orders.find(e => e.customerId === customer._id && e.externalId === String(omieAccountPayable.cabecTitulo.nCodOS))
        const invoice = billing.find(e => e.customerId === customer._id && e.externalId === String(omieAccountPayable.cabecTitulo.nCodNF))
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
        const emptyRecord = await makeEmptyRecord(emptyRecordsIds.accountPayable, accountsPayable[0])
        accountsPayable.push(emptyRecord)
      }
      await repositories.accountsPayable.deleteOldAndCreateNew(['companyId', 'customerId', 'titleId'], accountsPayable)
    }
  }

  const updateAccountsReceivable = async ({ credentials, companyId, startDate, endDate, emptyRecordsIds, titleMapping, repositories }) => {
    const omieAccountsReceivable = await omieService.getAccountsReceivable(credentials, { startDate, endDate })

    if (omieAccountsReceivable.length) {
      const customersSet = new Set()
      const projectsSet = new Set()
      const categoriesSet = new Set()
      const departmentsSet = new Set()
      const contractsSet = new Set()
      const ordersSet = new Set()
      const billingSet = new Set()

      omieAccountsReceivable.forEach(omieAccountReceivable => {
        customersSet.add(String(omieAccountReceivable.cabecTitulo.nCodCliente || ''))
        projectsSet.add(String(omieAccountReceivable.cabecTitulo.cCodProjeto || ''))
        contractsSet.add(String(omieAccountReceivable.cabecTitulo.nCodCtr || ''))
        ordersSet.add(String(omieAccountReceivable.cabecTitulo.nCodOS || ''))
        billingSet.add(String(omieAccountReceivable.cabecTitulo.nCodNF || ''));
        (omieAccountReceivable.departamentos?.length ? omieAccountReceivable.departamentos : []).forEach(omieAccountReceivableDepartment => {
          departmentsSet.add(String(omieAccountReceivableDepartment.cCodDepartamento || ''))
        });
        (omieAccountReceivable.cabecTitulo.aCodCateg?.length ? omieAccountReceivable.cabecTitulo.aCodCateg : [{ cCodCateg: omieAccountReceivable.cabecTitulo.cCodCateg }]).forEach(omieAccountReceivableCategory => {
          categoriesSet.add(String(omieAccountReceivableCategory.cCodCateg || ''))
        })
      })

      const customersFilter = [...customersSet].filter(Boolean)
      const projectsFilter = [...projectsSet].filter(Boolean)
      const categoriesFilter = [...categoriesSet].filter(Boolean)
      const departmentsFilter = [...departmentsSet].filter(Boolean)
      const contractsFilter = [...contractsSet].filter(Boolean)
      const ordersFilter = [...ordersSet].filter(Boolean)
      const billingFilter = [...billingSet].filter(Boolean)

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
        const order = orders.find(e => e.customerId === customer._id && e.externalId === String(omieAccountReceivable.cabecTitulo.nCodOS))
        const invoice = billing.find(e => e.customerId === customer._id && e.externalId === String(omieAccountReceivable.cabecTitulo.nCodNF))
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
        const emptyRecord = await makeEmptyRecord(emptyRecordsIds.accountReceivable, accountsReceivable[0])
        accountsReceivable.push(emptyRecord)
      }
      await repositories.accountsReceivable.deleteOldAndCreateNew(['companyId', 'customerId', 'titleId'], accountsReceivable)
    }
  }

  const updateFinancialMovements = async ({ credentials, companyId, startDate, endDate, emptyRecordsIds, financialMovementMapping, repositories }) => {
    const omieFinancialMovementsResult = await omieService.getFinancialMovements(credentials, { startDate, endDate })
    const omieFinancialMovements = omieFinancialMovementsResult.filter(e => e.detalhes.cStatus !== 'PREVISAO')

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
        customersSet.add(String(omieFinancialMovement.detalhes.nCodCliente || ''))
        projectsSet.add(String(omieFinancialMovement.detalhes.cCodProjeto || ''))
        checkingAccountsSet.add(String(omieFinancialMovement.detalhes.nCodCC || ''))
        contractsSet.add(String(omieFinancialMovement.detalhes.nCodCtr || ''))
        ordersSet.add(String(omieFinancialMovement.detalhes.nCodOS || ''))
        billingSet.add(String(omieFinancialMovement.detalhes.nCodNF || ''))
        titlesSet.add(String(omieFinancialMovement.detalhes.nCodTitulo || ''));
        (omieFinancialMovement.departamentos?.length ? omieFinancialMovement.departamentos : []).forEach(omieFinancialMovementDepartment => {
          departmentsSet.add(String(omieFinancialMovementDepartment.cCodDepartamento || ''))
        });
        (omieFinancialMovement.categorias?.length ? omieFinancialMovement.categorias : [{ cCodCateg: omieFinancialMovement.detalhes.cCodCateg }]).forEach(omieFinancialMovementCategory => {
          categoriesSet.add(String(omieFinancialMovementCategory.cCodCateg || ''))
        })
      })

      const customersFilter = [...customersSet].filter(Boolean)
      const projectsFilter = [...projectsSet].filter(Boolean)
      const categoriesFilter = [...categoriesSet].filter(Boolean)
      const departmentsFilter = [...departmentsSet].filter(Boolean)
      const checkingAccountsFilter = [...checkingAccountsSet].filter(Boolean)
      const contractsFilter = [...contractsSet].filter(Boolean)
      const ordersFilter = [...ordersSet].filter(Boolean)
      const billingFilter = [...billingSet].filter(Boolean)
      const titlesFilter = [...titlesSet].filter(Boolean)

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
        const order = orders.find(e => e.customerId === customer?._id && e.externalId === String(omieFinancialMovement.detalhes.nCodOS))
        const invoice = billing.find(e => e.customerId === customer?._id && e.externalId === String(omieFinancialMovement.detalhes.nCodNF))
        const accountPayable = accountsPayable.find(e => e.customerId === customer?._id && e.externalId === String(omieFinancialMovement.detalhes.nCodTitulo))
        const accountReceivable = accountsReceivable.find(e => e.customerId === customer?._id && e.externalId === String(omieFinancialMovement.detalhes.nCodTitulo))
        return (omieFinancialMovement.departamentos?.length ? omieFinancialMovement.departamentos : [{}]).map(omieFinancialMovementDepartment => {
          const department = departments.find(e => e.externalId === String(omieFinancialMovementDepartment.cCodDepartamento))
          return (omieFinancialMovement.categorias?.length ? omieFinancialMovement.categorias : [{ cCodCateg: omieFinancialMovement.detalhes.cCodCateg }]).map(omieFinancialMovementCategory => {
            const category = categories.find(e => e.externalId === String(omieFinancialMovementCategory.cCodCateg))
            return financialMovementMapping({
              omieFinancialMovement: omieFinancialMovement,
              omieFinancialMovementDepartment: omieFinancialMovementDepartment,
              omieFinancialMovementCategory: omieFinancialMovementCategory,
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

      const emptyRecord = await makeEmptyRecord(emptyRecordsIds.financialMovement, financialMovements[0])
      financialMovements.push(emptyRecord)
      await repositories.financialMovements.deleteOldAndCreateNew(['companyId', 'customerId', 'movementId'], financialMovements)
    }
  }

  await updateBilling({
    credentials,
    companyId,
    emptyRecordsIds,
    startDate,
    endDate,
    productInvoiceMapping: omieMappings.productInvoice,
    serviceInvoiceMapping: omieMappings.serviceInvoice,
    productTaxCouponMapping: omieMappings.productTaxCoupon,
    repositories
  })

  await updateAccountsPayable({
    credentials,
    companyId,
    emptyRecordsIds,
    startDate,
    endDate,
    titleMapping: omieMappings.title,
    repositories
  })

  await updateAccountsReceivable({
    credentials,
    companyId,
    emptyRecordsIds,
    startDate,
    endDate,
    titleMapping: omieMappings.title,
    repositories
  })

  await updateFinancialMovements({
    credentials,
    companyId,
    emptyRecordsIds,
    startDate,
    endDate,
    financialMovementMapping: omieMappings.financialMovement,
    repositories
  })
}
