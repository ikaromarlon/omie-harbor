const { PRODUCT_TYPES } = require('../enums')
const getValidCodes = require('../utils/getValidCodes')
const joinRecordsByCfopAndMunicipalServiceCode = require('../utils/joinRecordsByCfopAndMunicipalServiceCode')

module.exports = async ({
  omieService,
  credentials,
  companyId,
  startDate,
  endDate,
  contractMapping,
  repositories
}) => {
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
      customersFilter.length ? repositories.customers.findMany({ companyId, externalId: customersFilter }) : [],
      projectsFilter.length ? repositories.projects.findMany({ companyId, externalId: projectsFilter }) : [],
      categoriesFilter.length ? repositories.categories.findMany({ companyId, externalId: categoriesFilter }) : [],
      departmentsFilter.length ? repositories.departments.findMany({ companyId, externalId: departmentsFilter }) : [],
      productsServicesFilter.length ? repositories.productsServices.findMany({ companyId, externalId: productsServicesFilter }) : []
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

    await repositories.contracts.deleteOldAndCreateNew(contracts, ['companyId', 'externalId', 'type'])
  }
}
