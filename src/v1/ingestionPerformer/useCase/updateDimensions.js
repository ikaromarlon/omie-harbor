const { PRODUCT_TYPES } = require('../../../common/enums')
const getValidCodes = require('../utils/getValidCodes')
const joinRecordsByCfopAndMunicipalServiceCode = require('../utils/joinRecordsByCfopAndMunicipalServiceCode')
const makeEmptyRecord = require('../utils/makeEmptyRecord')

module.exports = async ({
  omieService,
  credentials,
  startDate,
  endDate,
  companyId,
  omieMappings,
  repositories,
  omieBanks,
  omieCnae,
  emptyRecordsIds
}) => {
  const updateCategories = async ({ credentials, companyId, categoryMapping, categoriesRepository }) => {
    const omieCategories = await omieService.getCategories(credentials)
    const categories = omieCategories.map(omieCategory => categoryMapping({ omieCategory, companyId }))
    if (categories.length) {
      const emptyRecord = makeEmptyRecord(emptyRecordsIds.category, categories[0])
      categories.push(emptyRecord)
      await categoriesRepository.createOrUpdateMany(['companyId', 'externalId'], categories)
    }
  }

  const updateDepartments = async ({ credentials, companyId, startDate, endDate, departmentMapping, departmentsRepository }) => {
    const omieDepartments = await omieService.getDepartments(credentials, { startDate, endDate })
    const departments = omieDepartments.map(omieDepartment => departmentMapping({ omieDepartment, companyId }))
    if (departments.length) {
      const emptyRecord = makeEmptyRecord(emptyRecordsIds.department, departments[0])
      departments.push(emptyRecord)
      await departmentsRepository.createOrUpdateMany(['companyId', 'externalId'], departments)
    }
  }

  const updateProjects = async ({ credentials, companyId, startDate, endDate, projectMapping, projectsRepository }) => {
    const omieProjects = await omieService.getProjects(credentials, { startDate, endDate })
    const projects = omieProjects.map(omieProject => projectMapping({ omieProject, companyId }))
    if (projects.length) {
      const emptyRecord = makeEmptyRecord(emptyRecordsIds.project, projects[0])
      projects.push(emptyRecord)
      await projectsRepository.createOrUpdateMany(['companyId', 'externalId'], projects)
    }
  }

  const updateCustomers = async ({ credentials, companyId, startDate, endDate, omieCnae, omieBanks, customerMapping, customersRepository }) => {
    const omieCustomers = await omieService.getCustomers(credentials, { startDate, endDate })
    if (omieCustomers.length) {
      const omieActivities = await omieService.getActivities(credentials)
      const customers = omieCustomers.map(omieCustomer => customerMapping({ omieCustomer, omieActivities, omieCnae, omieBanks, companyId }))
      if (customers.length) {
        const emptyRecord = makeEmptyRecord(emptyRecordsIds.customer, customers[0])
        customers.push(emptyRecord)
        await customersRepository.createOrUpdateMany(['companyId', 'externalId'], customers)
      }
    }
  }

  const updateProductsServices = async ({ credentials, companyId, startDate, endDate, productMapping, serviceMapping, productsServicesRepository }) => {
    const [
      omieProducts,
      omieServicesCreated,
      omieServicesUpdated
    ] = await Promise.all([
      omieService.getProducts(credentials, { startDate, endDate }),
      omieService.getServices(credentials, { createdFrom: startDate, createdTo: endDate }),
      omieService.getServices(credentials, { updatedFrom: startDate, updatedTo: endDate })
    ])
    const products = omieProducts.map(omieProduct => productMapping({ omieProduct, companyId }))

    const omieServices = Array.from(
      [...omieServicesCreated, ...omieServicesUpdated]
        .reduce((acc, el) => { acc.set(el.intListar.nCodServ, el); return acc }, new Map())
        .values()
    )

    const services = omieServices.map(omieService => serviceMapping({ omieService, companyId }))

    const productsServices = [...products, ...services]

    if (productsServices.length) {
      const emptyRecord = makeEmptyRecord(emptyRecordsIds.productService, productsServices[0])
      productsServices.push(emptyRecord)
      await productsServicesRepository.createOrUpdateMany(['companyId', 'externalId'], productsServices)
    }
  }

  const updateCheckingAccounts = async ({ credentials, companyId, startDate, endDate, omieBanks, checkingAccountMapping, checkingAccountsRepository }) => {
    const omieCheckingAccounts = await omieService.getCheckingAccounts(credentials, { startDate, endDate })
    if (omieCheckingAccounts.length) {
      const omieCheckingAccountTypes = await omieService.getCheckingAccountTypes(credentials)
      const checkingAccounts = omieCheckingAccounts.map(omieCheckingAccount => checkingAccountMapping({ omieCheckingAccount, omieBanks, omieCheckingAccountTypes, companyId }))
      const emptyRecord = makeEmptyRecord(emptyRecordsIds.checkingAccount, checkingAccounts[0])
      checkingAccounts.push(emptyRecord)
      await checkingAccountsRepository.createOrUpdateMany(['companyId', 'externalId'], checkingAccounts)
    }
  }

  const updateContracts = async ({ credentials, companyId, startDate, endDate, emptyRecordsIds, contractMapping, repositories }) => {
    const omieContracts = await omieService.getContracts(credentials, { startDate, endDate })

    if (omieContracts.length) {
      const omieContractSteps = await omieService.getContractSteps(credentials)
      const omieContractBillingTypes = await omieService.getContractBillingTypes(credentials)

      const customersSet = new Set()
      const projectsSet = new Set()
      const categoriesSet = new Set()
      const departmentsSet = new Set()
      const productsServicesSet = new Set()

      omieContracts.forEach(omieContract => {
        customersSet.add(String(omieContract.cabecalho.nCodCli))
        projectsSet.add(String(omieContract.infAdic.nCodProj));
        (omieContract.departamentos?.length ? omieContract.departamentos : []).forEach(omieContractDepartment => {
          departmentsSet.add(String(omieContractDepartment.cCodDep))
        })
        omieContract.itensContrato.forEach(omieContractItem => {
          productsServicesSet.add(String(omieContractItem.itemCabecalho.codServico))
          categoriesSet.add(String(omieContractItem.itemCabecalho.cCodCategItem))
        })
      })

      const customersFilter = [...customersSet].filter(getValidCodes)
      const projectsFilter = [...projectsSet].filter(getValidCodes)
      const categoriesFilter = [...categoriesSet].filter(getValidCodes)
      const departmentsFilter = [...departmentsSet].filter(getValidCodes)
      const productsServicesFilter = [...productsServicesSet].filter(getValidCodes)

      const [
        customers,
        projects,
        categories,
        departments,
        productsServices
      ] = await Promise.all([
        customersFilter.length ? repositories.customers.find({ companyId, externalId: customersFilter }) : [],
        projectsFilter.length ? repositories.projects.find({ companyId, externalId: projectsFilter }) : [],
        categoriesFilter.length ? repositories.categories.find({ companyId, externalId: categoriesFilter }) : [],
        departmentsFilter.length ? repositories.departments.find({ companyId, externalId: departmentsFilter }) : [],
        productsServicesFilter.length ? repositories.productsServices.find({ companyId, externalId: productsServicesFilter }) : []
      ])

      const contracts = omieContracts.map(omieContract => {
        const customer = customers.find(e => e.externalId === String(omieContract.cabecalho.nCodCli))
        const project = projects.find(e => e.externalId === String(omieContract.infAdic.nCodProj))
        return (omieContract.departamentos?.length ? omieContract.departamentos : [{}]).map(omieContractDepartment => {
          const department = departments.find(e => e.externalId === String(omieContractDepartment.cCodDep))
          return omieContract.itensContrato.map(omieContractItem => {
            const productService = productsServices.find(e => e.externalId === String(omieContractItem.itemCabecalho.codServico) && e.type === PRODUCT_TYPES.SERVICE)
            const category = categories.find(e => e.externalId === String(omieContractItem.itemCabecalho.cCodCategItem))
            return contractMapping({
              omieContract,
              omieContractDepartment,
              omieContractItem,
              omieContractBillingTypes,
              omieContractSteps,
              companyId,
              customerId: customer?._id,
              projectId: project?._id,
              departmentId: department?._id,
              productServiceId: productService?._id,
              categoryId: category?._id,
              emptyRecordsIds
            })
          })
        })
      }).flatMap(x => x.flatMap(y => y))
        .reduce(joinRecordsByCfopAndMunicipalServiceCode, [])

      const emptyRecord = makeEmptyRecord(emptyRecordsIds.contract, contracts[0])
      contracts.push(emptyRecord)
      await repositories.contracts.deleteOldAndCreateNew(['companyId', 'customerId', 'externalId', 'type'], contracts)
    }
  }

  const updateOrders = async ({ credentials, companyId, startDate, endDate, emptyRecordsIds, productOrderMapping, serviceOrderMapping, repositories }) => {
    const [
      omieProductOrders,
      omieServiceOrders
    ] = await Promise.all([
      omieService.getProductOrders(credentials, { startDate, endDate }),
      omieService.getServiceOrders(credentials, { startDate, endDate })
    ])

    if (omieProductOrders.length || omieServiceOrders.length) {
      const omieBillingSteps = await omieService.getBillingSteps(credentials)

      const customersSet = new Set()
      const projectsSet = new Set()
      const categoriesSet = new Set()
      const departmentsSet = new Set()
      const productsServicesSet = new Set()
      const contractsSet = new Set()

      omieProductOrders.forEach(omieOrder => {
        customersSet.add(String(omieOrder.cabecalho.codigo_cliente))
        projectsSet.add(String(omieOrder.informacoes_adicionais.codProj));
        (omieOrder.departamentos?.length ? omieOrder.departamentos : []).forEach(omieOrderDepartment => {
          departmentsSet.add(String(omieOrderDepartment.cCodDepto))
        })
        omieOrder.det.forEach(omieOrderItem => {
          productsServicesSet.add(String(omieOrderItem.produto.codigo_produto))
          categoriesSet.add(String(omieOrderItem.inf_adic.codigo_categoria_item))
        })
      })

      omieServiceOrders.forEach(omieOrder => {
        customersSet.add(String(omieOrder.Cabecalho.nCodCli))
        projectsSet.add(String(omieOrder.InformacoesAdicionais.nCodProj))
        contractsSet.add(String(omieOrder.InformacoesAdicionais.cNumContrato));
        (omieOrder.Departamentos?.length ? omieOrder.Departamentos : []).forEach(omieOrderDepartment => {
          departmentsSet.add(String(omieOrderDepartment.cCodDepto))
        })
        omieOrder.ServicosPrestados.forEach(omieOrderItem => {
          productsServicesSet.add(String(omieOrderItem.nCodServico))
          categoriesSet.add(String(omieOrderItem.cCodCategItem))
        })
      })

      const customersFilter = [...customersSet].filter(getValidCodes)
      const projectsFilter = [...projectsSet].filter(getValidCodes)
      const categoriesFilter = [...categoriesSet].filter(getValidCodes)
      const departmentsFilter = [...departmentsSet].filter(getValidCodes)
      const productsServicesFilter = [...productsServicesSet].filter(getValidCodes)
      const contractsFilter = [...contractsSet].filter(getValidCodes)

      const [
        customers,
        projects,
        categories,
        departments,
        productsServices,
        contracts
      ] = await Promise.all([
        customersFilter.length ? repositories.customers.find({ companyId, externalId: customersFilter }) : [],
        projectsFilter.length ? repositories.projects.find({ companyId, externalId: projectsFilter }) : [],
        categoriesFilter.length ? repositories.categories.find({ companyId, externalId: categoriesFilter }) : [],
        departmentsFilter.length ? repositories.departments.find({ companyId, externalId: departmentsFilter }) : [],
        productsServicesFilter.length ? repositories.productsServices.find({ companyId, externalId: productsServicesFilter }) : [],
        contractsFilter.length ? repositories.contracts.find({ companyId, contractNumber: contractsFilter }) : []
      ])

      const productOrders = omieProductOrders.map(omieOrder => {
        const customer = customers.find(e => e.externalId === String(omieOrder.cabecalho.codigo_cliente))
        const project = projects.find(e => e.externalId === String(omieOrder.informacoes_adicionais.codProj))
        return (omieOrder.departamentos?.length ? omieOrder.departamentos : [{}]).map(omieOrderDepartment => {
          const department = departments.find(e => e.externalId === String(omieOrderDepartment.cCodDepto))
          return omieOrder.det.map(omieOrderItem => {
            const productService = productsServices.find(e => e.externalId === String(omieOrderItem.produto.codigo_produto) && e.type === PRODUCT_TYPES.PRODUCT)
            const category = categories.find(e => e.externalId === String(omieOrderItem.inf_adic.codigo_categoria_item))
            return productOrderMapping({
              omieOrder,
              omieOrderDepartment,
              omieOrderItem,
              omieBillingSteps,
              companyId,
              customerId: customer?._id,
              projectId: project?._id,
              departmentId: department?._id,
              productServiceId: productService?._id,
              categoryId: category?._id,
              emptyRecordsIds
            })
          })
        })
      }).flatMap(x => x.flatMap(y => y))
        .reduce(joinRecordsByCfopAndMunicipalServiceCode, [])

      const serviceOrders = omieServiceOrders.map(omieOrder => {
        const customer = customers.find(e => e.externalId === String(omieOrder.Cabecalho.nCodCli))
        const project = projects.find(e => e.externalId === String(omieOrder.InformacoesAdicionais.nCodProj))
        const contract = contracts.find(e => e.customerId === customer?._id && e.contractNumber === String(omieOrder.InformacoesAdicionais.cNumContrato))
        return (omieOrder.Departamentos?.length ? omieOrder.Departamentos : [{}]).map(omieOrderDepartment => {
          const department = departments.find(e => e.externalId === String(omieOrderDepartment.cCodDepto))
          return omieOrder.ServicosPrestados.map(omieOrderItem => {
            const productService = productsServices.find(e => e.externalId === String(omieOrderItem.nCodServico) && e.type === PRODUCT_TYPES.SERVICE)
            const category = categories.find(e => e.externalId === String(omieOrderItem.cCodCategItem))
            return serviceOrderMapping({
              omieOrder,
              omieOrderDepartment,
              omieOrderItem,
              omieBillingSteps,
              companyId,
              customerId: customer?._id,
              projectId: project?._id,
              departmentId: department?._id,
              productServiceId: productService?._id,
              categoryId: category?._id,
              emptyRecordsIds,
              contractId: contract?._id
            })
          })
        })
      }).flatMap(x => x.flatMap(y => y))
        .reduce(joinRecordsByCfopAndMunicipalServiceCode, [])

      const orders = [...productOrders, ...serviceOrders]

      const emptyRecord = makeEmptyRecord(emptyRecordsIds.order, orders[0])
      orders.push(emptyRecord)
      await repositories.orders.deleteOldAndCreateNew(['companyId', 'customerId', 'externalId', 'type'], orders)
    }
  }

  await updateCategories({
    credentials,
    companyId,
    categoryMapping: omieMappings.category,
    categoriesRepository: repositories.categories
  })

  await updateDepartments({
    credentials,
    companyId,
    startDate,
    endDate,
    departmentMapping: omieMappings.department,
    departmentsRepository: repositories.departments
  })

  await updateProjects({
    credentials,
    companyId,
    startDate,
    endDate,
    projectMapping: omieMappings.project,
    projectsRepository: repositories.projects
  })

  await updateCustomers({
    credentials,
    companyId,
    startDate,
    endDate,
    omieCnae,
    omieBanks,
    customerMapping: omieMappings.customer,
    customersRepository: repositories.customers
  })

  await updateProductsServices({
    credentials,
    companyId,
    startDate,
    endDate,
    productMapping: omieMappings.product,
    serviceMapping: omieMappings.service,
    productsServicesRepository: repositories.productsServices
  })

  await updateCheckingAccounts({
    credentials,
    companyId,
    startDate,
    endDate,
    omieBanks,
    checkingAccountMapping: omieMappings.checkingAccount,
    checkingAccountsRepository: repositories.checkingAccounts
  })

  await updateContracts({
    credentials,
    companyId,
    startDate,
    endDate,
    emptyRecordsIds,
    contractMapping: omieMappings.contract,
    repositories
  })

  await updateOrders({
    credentials,
    companyId,
    startDate,
    endDate,
    emptyRecordsIds,
    productOrderMapping: omieMappings.productOrder,
    serviceOrderMapping: omieMappings.serviceOrder,
    repositories
  })
}
