const { PRODUCT_TYPES, ORDER_TYPES } = require('../enums')
const getValidCodes = require('../utils/getValidCodes')
const joinRecordsByCfopAndMunicipalServiceCode = require('../utils/joinRecordsByCfopAndMunicipalServiceCode')

module.exports = async ({
  omieService,
  credentials,
  companyId,
  startDate,
  endDate,
  productInvoiceMapping,
  serviceInvoiceMapping,
  repositories
}) => {
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
      customersFilter.length ? repositories.customers.findMany({ companyId, externalId: customersFilter }) : [],
      projectsFilter.length ? repositories.projects.findMany({ companyId, externalId: projectsFilter }) : [],
      departmentsFilter.length ? repositories.departments.findMany({ companyId, externalId: departmentsFilter }) : [],
      productsFilter.length ? repositories.productsServices.findMany({ companyId, externalId: productsFilter, type: PRODUCT_TYPES.PRODUCT }) : [],
      servicesFilter.length ? repositories.productsServices.findMany({ companyId, municipalServiceCode: servicesFilter, type: PRODUCT_TYPES.SERVICE }) : [], /** Omie returns CodigoServico as municipalServiceCode in NFS-e API */
      contractsFilter.length ? repositories.contracts.findMany({ companyId, externalId: contractsFilter }) : [],
      ordersFilter.length ? repositories.orders.findMany({ companyId, externalId: ordersFilter }) : []
    ])

    const productInvoices = omieProductInvoices.map(omieInvoice => {
      const customer = customers.find(e => e.externalId === String(omieInvoice.nfDestInt.nCodCli))
      const salesOrders = orders.filter(e => e.externalId === String(omieInvoice.compl.nIdPedido) && e.type === ORDER_TYPES.SALES_ORDER)
      if (salesOrders.length || (!omieInvoice.compl.nIdPedido || omieInvoice.compl.nIdPedido === '0')) {
        return (omieInvoice.pedido.Departamentos?.length ? omieInvoice.pedido.Departamentos : [{}]).map(omieInvoiceDepartment => {
          const department = departments.find(e => e.externalId === String(omieInvoiceDepartment.cCodigoDepartamento))
          return omieInvoice.det.map(omieInvoiceItem => {
            const product = products.find(e => e.externalId === String(omieInvoiceItem.nfProdInt.nCodProd))
            const order = salesOrders.find(e => e.productServiceId === product?.id && [department?.id, null].includes(e.departmentId))
            return productInvoiceMapping({
              omieInvoice,
              omieInvoiceDepartment,
              omieInvoiceItem,
              order,
              companyId,
              customerId: customer?.id,
              projectId: order?.projectId,
              departmentId: department?.id,
              productServiceId: product?.id,
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
          const order = serviceOrders.find(e => e.productServiceId === service?.id && [department?.id, null].includes(e.departmentId))
          return serviceInvoiceMapping({
            omieInvoice,
            omieInvoiceDepartment,
            omieInvoiceItem,
            order,
            companyId,
            customerId: customer?.id,
            projectId: project?.id,
            departmentId: department?.id,
            productServiceId: service?.id,
            categoryId: order?.categoryId,
            contractId: contract?.id
          })
        })
      })
    }).flatMap(x => x.flatMap(y => y))
      .reduce(joinRecordsByCfopAndMunicipalServiceCode, [])

    const invoices = [...productInvoices, ...serviceInvoices]

    await repositories.billing.deleteOldAndCreateNew(invoices, ['companyId', 'externalId', 'type'])
  }
}
