const { PRODUCT_TYPES } = require('../enums')
const getValidCodes = require('../utils/getValidCodes')
const joinRecordsByCfopAndMunicipalServiceCode = require('../utils/joinRecordsByCfopAndMunicipalServiceCode')

module.exports = async ({
  omieService,
  credentials,
  companyId,
  startDate,
  endDate,
  productOrderMapping,
  serviceOrderMapping,
  repositories
}) => {
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
      customersFilter.length ? repositories.customers.findMany({ companyId, externalId: customersFilter }) : [],
      projectsFilter.length ? repositories.projects.findMany({ companyId, externalId: projectsFilter }) : [],
      categoriesFilter.length ? repositories.categories.findMany({ companyId, externalId: categoriesFilter }) : [],
      departmentsFilter.length ? repositories.departments.findMany({ companyId, externalId: departmentsFilter }) : [],
      productsServicesFilter.length ? repositories.productsServices.findMany({ companyId, externalId: productsServicesFilter }) : [],
      contractsFilter.length ? repositories.contracts.findMany({ companyId, contractNumber: contractsFilter }) : []
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
            customerId: customer?.id,
            projectId: project?.id,
            departmentId: department?.id,
            productServiceId: productService?.id,
            categoryId: category?.id
          })
        })
      })
    }).flatMap(x => x.flatMap(y => y))
      .reduce(joinRecordsByCfopAndMunicipalServiceCode, [])

    const serviceOrders = omieServiceOrders.map(omieOrder => {
      const customer = customers.find(e => e.externalId === String(omieOrder.Cabecalho.nCodCli))
      const project = projects.find(e => e.externalId === String(omieOrder.InformacoesAdicionais.nCodProj))
      const contract = contracts.find(e => e.contractNumber === String(omieOrder.InformacoesAdicionais.cNumContrato))
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
            customerId: customer?.id,
            projectId: project?.id,
            departmentId: department?.id,
            productServiceId: productService?.id,
            categoryId: category?.id,
            contractId: contract?.id
          })
        })
      })
    }).flatMap(x => x.flatMap(y => y))
      .reduce(joinRecordsByCfopAndMunicipalServiceCode, [])

    const orders = [...productOrders, ...serviceOrders]

    await repositories.orders.deleteOldAndCreateNew(orders, ['companyId', 'externalId', 'type'])
  }
}
